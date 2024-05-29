using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExecutorController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public ExecutorController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet("Find")]
        public async Task<IActionResult> Find(string filter = "")
        {
            var items = await _db.Executors.Where(x =>
                x.FirstName.Contains(filter) ||
                x.SecondName.Contains(filter) ||
                x.Patronymic.Contains(filter))
                .Take(50)
                .ToListAsync();

            return Ok(items);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int pageNumber = 1, string filter = "")
        {
            var query = _db.Executors
                .Where(x =>
                    x.FirstName.Contains(filter) ||
                    x.SecondName.Contains(filter) ||
                    x.Patronymic.Contains(filter))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<Executor>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.Executors.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Executor item)
        {
            _db.Executors.Add(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(Executor item)
        {
            _db.Update(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Executors.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.Executors.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}