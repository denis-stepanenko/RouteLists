using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListModificationController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListModificationController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int routeListId, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteListModifications
                            .Include(x => x.Executor)
                            .Where(x => x.RouteListId == routeListId)
                            .Where(x => x.Code.Contains(filter) || x.Name.Contains(filter))
                            .OrderByDescending(x => x.Id);

            var result = await PagedList<RouteListModification>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteListModifications
                .Include(x => x.Executor)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateRouteListModificationDto dto)
        {
            var operations = new List<Operation>();

            foreach (var id in dto.Ids)
            {
                var operation = await _db.Operations.FindAsync(id);

                if (operation != null)
                    operations.Add(operation);
            }

            foreach (var operation in operations)
            {
                _db.RouteListModifications.Add(new()
                {
                    RouteListId = dto.RouteListId,
                    Code = operation.Code,
                    Name = operation.Name,
                    DocumentNumber = dto.DocumentNumber,
                    ExecutorId = dto.ExecutorId
                });
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteListModification item)
        {
            var original = await _db.RouteListModifications.FindAsync(item.Id);

            if (original is null)
                return NotFound();

            original.DocumentNumber = item.DocumentNumber;
            original.ExecutorId = item.ExecutorId;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteListModifications.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.RouteListModifications.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}