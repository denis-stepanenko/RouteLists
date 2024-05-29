using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OperationController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public OperationController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int pageNumber = 1, string filter = "")
        {
            var query = _db.Operations
                .Where(x => 
                    x.Code.Contains(filter) ||
                    x.Name.Contains(filter) ||
                    (x.GroupName ?? "").Contains(filter))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<Operation>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.Operations.FindAsync(id);

            if(item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Operation item)
        {
            if(await _db.Operations.AnyAsync(x => x.Name == item.Name))
            {
                return BadRequest("Уже существует операция с таким именем");
            }

            _db.Operations.Add(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(Operation item)
        {
            _db.Update(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Operations.FindAsync(id);

            if(item is null)
                return NotFound();

            _db.Operations.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}