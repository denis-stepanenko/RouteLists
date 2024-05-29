using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListDocumentController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListDocumentController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int routeListId, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteListDocuments
                .Where(x => x.RouteListId == routeListId && x.Name.Contains(filter))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<RouteListDocument>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteListDocuments.FindAsync(id);

            if(item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(RouteListDocument item)
        {
            _db.RouteListDocuments.Add(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteListDocument item)
        {
            _db.Update(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteListDocuments.FindAsync(id);

            if(item is null)
                return NotFound();

            _db.RouteListDocuments.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}