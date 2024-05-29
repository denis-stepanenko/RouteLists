using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListRepairController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListRepairController(ApplicationContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int routeListId, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteListRepairs
                .Include(x => x.Executor)
                .Where(x => x.RouteListId == routeListId)
                .Where(x =>
                    x.Code.Contains(filter) ||
                    x.Name.Contains(filter) ||
                    (x.Reason ?? "").Contains(filter))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<RouteListRepair>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteListRepairs
                .Include(x => x.Executor)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateRouteListRepairDto dto)
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
                _db.RouteListRepairs.Add(new()
                {
                    RouteListId = dto.RouteListId,
                    Code = operation.Code,
                    Name = operation.Name,
                    Reason = dto.Reason,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Date = dto.Date,
                    ExecutorId = dto.ExecutorId
                });
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteListRepair item)
        {
            var original = await _db.RouteListRepairs.FindAsync(item.Id);

            if (original is null)
                return NotFound();

            original.Reason = item.Reason;
            original.StartDate = item.StartDate;
            original.EndDate = item.EndDate;
            original.Date = item.Date;
            original.ExecutorId = item.ExecutorId;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteListRepairs.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.RouteListRepairs.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}