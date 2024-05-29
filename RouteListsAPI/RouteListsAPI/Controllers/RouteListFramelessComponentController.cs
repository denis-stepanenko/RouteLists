using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListFramelessComponentController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListFramelessComponentController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int routeListId, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteListFramelessComponents
                    .Where(x => x.RouteListId == routeListId && (
                        x.Code.Contains(filter) ||
                        x.Name.Contains(filter)))
                    .OrderByDescending(x => x.Id);

            var result = await PagedList<RouteListFramelessComponent>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteListFramelessComponents.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create(CreateRouteListFramelessComponentDto dto)
        {
            var products = new List<PurchasedProduct>();

            foreach (var id in dto.Ids)
            {
                var product = await _db.PurchasedProducts.FindAsync(id);

                if (product != null)
                    products.Add(product);
            }

            foreach (var product in products)
            {
                _db.RouteListFramelessComponents.Add(new()
                {
                    RouteListId = dto.RouteListId,
                    Code = product.Code,
                    Name = product?.Name ?? "",
                    DateOfIssueForProduction = dto.DateOfIssueForProduction,
                    DateOfSealing = dto.DateOfSealing,
                    DaysBeforeSealing = dto.DaysBeforeSealing
                });
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteListFramelessComponent item)
        {
            var original = await _db.RouteListFramelessComponents.FindAsync(item.Id);

            if (original is null)
                return NotFound();

            original.DateOfIssueForProduction = item.DateOfIssueForProduction;
            original.DateOfSealing = item.DateOfSealing;
            original.DaysBeforeSealing = item.DaysBeforeSealing;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteListFramelessComponents.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.RouteListFramelessComponents.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}