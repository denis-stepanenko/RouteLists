using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public ProductController(ApplicationContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string filter = "")
        {
            var items =
            await _db.OwnProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name, TableId = 2 })
                            .Union(_db.PurchasedProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name ?? "", TableId = 1 }))
                            .Where(x => x.Code.Contains(filter) || x.Name.Contains(filter))
                            .Take(50)
                            .ToListAsync();

            return Ok(items);
        }

        [HttpGet("GetPurchasedProducts")]
        public async Task<IActionResult> GetPurchasedProducts(int pageNumber = 1, string filter = "")
        {
            var query = _db.PurchasedProducts
                .Where(x => x.Code.Contains(filter) || (x.Name ?? "").Contains(filter));

            var result = await PagedList<PurchasedProduct>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [HttpGet("GetProducts")]
        public async Task<IActionResult> GetProducts(int pageNumber = 1, string filter = "")
        {
            var query = _db.OwnProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name, TableId = 2 })
                            .Union(_db.PurchasedProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name ?? "", TableId = 1 }))
                            .Where(x => x.Code.Contains(filter) || x.Name.Contains(filter));

            var result = await PagedList<ProductDto>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetRoute(string productCode)
        {
            string? route = await _db.GetProductRouteAsync(productCode);

            return Ok(route);
        }

        [HttpGet("GetPickingList")]
        public async Task<IActionResult> GetPickingList(string productCode, int pageNumber = 1, string filter = "")
        {
            var items = await _db.GetPickingListAsync(productCode, 1);

            Response.AddPaginationHeader(pageNumber, 100, items.Count, (int)Math.Ceiling(items.Count / (double)100));

            var result = items.Where(x =>
                x.Code.ToLower().Contains(filter.ToLower()) ||
                x.Name.ToLower().Contains(filter.ToLower()))
            .OrderBy(x => x.Name)
            .Skip((pageNumber - 1) * 100).Take(100).ToList();

            return Ok(result);
        }
    }
}