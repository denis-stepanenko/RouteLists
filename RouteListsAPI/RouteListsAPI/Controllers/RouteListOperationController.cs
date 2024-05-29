using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListOperationController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListOperationController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> Get(int routeListId, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteListOperations
                .Include(x => x.Executor)
                .Where(x => x.RouteListId == routeListId)
                .Where(x => x.Code.Contains(filter) || x.Name.Contains(filter))
                .OrderBy(x => x.Position);

            var result = await PagedList<RouteListOperation>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteListOperations.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateRouteListOperationDto dto)
        {
            var operations = new List<Operation>();

            foreach (var id in dto.Ids)
            {
                var operation = await _db.Operations.FindAsync(id);

                if(operation != null)
                    operations.Add(operation);
            }

            foreach (var operation in operations)
            {
                int maxPosition = await _db.RouteListOperations
                    .Where(x => x.RouteListId == dto.RouteListId)
                    .Select(x => x.Position)
                    .DefaultIfEmpty()
                    .MaxAsync();

                var item = new RouteListOperation
                {
                    Code = operation.Code,
                    Name = operation.Name,
                    Department = operation.Department,
                    Description = dto.Description,
                    Count = dto.Count,
                    Type = dto.Type,
                    Number = dto.Number,
                    RouteListId = dto.RouteListId,
                    Position = maxPosition + 1
                };

                _db.RouteListOperations.Add(item);

                await _db.SaveChangesAsync();
            }

            await RecalculatePositions(dto.RouteListId);

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteListOperation item)
        {
            var original = await _db.RouteListOperations.FindAsync(item.Id);

            if (original is null)
                return NotFound();

            original.Description = item.Description;
            original.Count = item.Count;
            original.Type = item.Type;
            original.Number = item.Number;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteListOperations.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.RouteListOperations.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("Swap")]
        public async Task<IActionResult> Swap(SwapDto dto)
        {
            var item = await _db.RouteListOperations.FindAsync(dto.Id);
            var item2 = await _db.RouteListOperations.FindAsync(dto.Id2);

            if(item is null || item2 is null)
                return NotFound();

            (item.Position, item2.Position) = (item2.Position, item.Position);

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("AreThereOperations")]
        public async Task<IActionResult> AreThereOperations(int routeListId)
        {
            var result = await _db.RouteListOperations.AnyAsync(x => x.RouteListId == routeListId);

            return Ok(result);
        }

        [HttpGet("GetNewNumber")]
        public async Task<IActionResult> GetNewNumber(int routeListId)
        {
            int maxNumber = await _db.RouteListOperations
                .Where(x => x.RouteListId == routeListId)
                .Select(x => Convert.ToInt32(x.Number ?? "0"))
                .DefaultIfEmpty()
                .MaxAsync();

            return Ok((maxNumber - (maxNumber % 5) + 5).ToString("000"));
        }   

        private async Task RecalculatePositions(int routeListId)
        {
            var routeListOperations = await _db.RouteListOperations
                .Where(x => x.RouteListId == routeListId)
                .OrderBy(x => x.Position)
                .ToListAsync();

            for (int i = 0; i < routeListOperations.Count; i++)
            {
                routeListOperations[i].Position = i + 1;
            }

            await _db.SaveChangesAsync();
        }
    }
}