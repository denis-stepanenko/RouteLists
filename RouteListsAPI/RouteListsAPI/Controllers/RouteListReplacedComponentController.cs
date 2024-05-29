using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListReplacedComponentController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListReplacedComponentController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int routeListId, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteListReplacedComponents
                .Include(x => x.Executor)
                .Where(x => x.RouteListId == routeListId && (
                    x.Code.Contains(filter) ||
                    x.Name.Contains(filter)))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<RouteListReplacedComponent>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteListReplacedComponents
                        .Include(x => x.Executor)
                        .FirstOrDefaultAsync(x => x.Id == id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateRouteListReplacedComponentDto dto)
        {
            var products = new List<ProductDto>();

            foreach (var productDto in dto.Products)
            {
                var product = await _db.OwnProducts.Select(x => new ProductDto { Id = x.Id, TableId = 2, Code = x.Code, Name = x.Name })
                        .Union(_db.PurchasedProducts.Select(x => new ProductDto { Id = x.Id, TableId = 1, Code = x.Code, Name = x.Name ?? "" }))
                        .FirstOrDefaultAsync(x => x.Id == productDto.Id && x.TableId == productDto.TableId);

               if(product != null)
                    products.Add(product);
            }

            foreach (var product in products)
            {
                _db.RouteListReplacedComponents.Add(new()
                {
                    RouteListId = dto.RouteListId,
                    Code = product.Code,
                    Name = product.Name,
                    FactoryNumber = dto.FactoryNumber,
                    ReplacementReason = dto.ReplacementReason,
                    Date = dto.Date,
                    ExecutorId = dto.ExecutorId
                });
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteListReplacedComponent item)
        {
            var original = await _db.RouteListReplacedComponents.FindAsync(item.Id);

            if (original is null)
                return NotFound();

            original.FactoryNumber = item.FactoryNumber;
            original.ReplacementReason = item.ReplacementReason;
            original.Date = item.Date;
            original.ExecutorId = item.ExecutorId;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteListReplacedComponents.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.RouteListReplacedComponents.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}