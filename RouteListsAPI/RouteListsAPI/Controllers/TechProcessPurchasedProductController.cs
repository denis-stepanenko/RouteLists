using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TechProcessPurchasedProductController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public TechProcessPurchasedProductController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int techProcessId, int pageNumber = 1, string filter = "")
        {
            var query = _db.TechProcessPurchasedProducts
                .Where(x => x.TechProducessId == techProcessId && (
                    x.Code.Contains(filter) ||
                    x.Name.Contains(filter)))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<TechProcessPurchasedProduct>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.TechProcessPurchasedProducts.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTechProcessPurchasedProductDto dto)
        {
            var products = new List<PickingListProduct>();

            foreach (var productDto in dto.Products)
            {
                var product = await _db.OwnProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name, TableId = 2 })
                    .Union(_db.PurchasedProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name ?? "", TableId = 1 }))
                    .Where(x => x.Code == productDto.Code)
                    .Select(x => new PickingListProduct { Code = x.Code, Name = x.Name, Count = productDto.Count })
                    .FirstOrDefaultAsync();

                if(product != null)
                    products.Add(product);
            }

            foreach (var product in products)
            {
                _db.TechProcessPurchasedProducts.Add(new() 
                {
                    TechProducessId = dto.TechProcessId,
                    Code = product.Code,
                    Name = product.Name,
                    Count = product.Count
                });
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(TechProcessPurchasedProduct item)
        {
            var original = await _db.TechProcessPurchasedProducts.FindAsync(item.Id);

            if(original is null)
                return NotFound();

            original.Count = item.Count;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.TechProcessPurchasedProducts.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.TechProcessPurchasedProducts.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}