using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TechProcessDocumentController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public TechProcessDocumentController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int techProcessId, int pageNumber = 1, string filter = "")
        {
            var query = _db.TechProcessDocuments
                .Where(x => x.TechProcessId == techProcessId && x.Name.Contains(filter))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<TechProcessDocument>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.TechProcessDocuments.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(TechProcessDocument item)
        {
            _db.TechProcessDocuments.Add(item);

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(TechProcessDocument item)
        {
            var original = await _db.TechProcessDocuments.FindAsync(item.Id);

            if (original is null)
                return NotFound();

            original.Name = item.Name;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.TechProcessDocuments.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.TechProcessDocuments.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}