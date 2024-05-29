using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListComponentController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListComponentController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int routeListId, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteListComponents
                .Where(x =>
                    x.RouteListId == routeListId &&
                    (x.Code.Contains(filter) || x.Name.Contains(filter)))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<RouteListComponent>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteListComponents.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateRouteListComponentDto dto)
        {
            var products = new List<ProductDto>();

            foreach (var productDto in dto.Products)
            {
                var product = await _db.OwnProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name, TableId = 2 })
                        .Union(_db.PurchasedProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name ?? "", TableId = 1 }))
                        .FirstOrDefaultAsync(x => x.Id == productDto.Id && x.TableId == productDto.TableId);

                if (product != null)
                    products.Add(product);
            }

            foreach (var product in products)
            {
                _db.RouteListComponents.Add(new()
                {
                    RouteListId = dto.RouteListId,
                    FactoryNumber = dto.FactoryNumber,
                    AccompanyingDocument = dto.AccompanyingDocument,
                    Count = dto.Count,
                    Code = product.Code,
                    Name = product.Name
                });
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteListComponent item)
        {
            var original = await _db.RouteListComponents.FindAsync(item.Id);

            if (original is null)
                return NotFound();

            original.FactoryNumber = item.FactoryNumber;
            original.AccompanyingDocument = item.AccompanyingDocument;
            original.Count = item.Count;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteListComponents.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.RouteListComponents.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}