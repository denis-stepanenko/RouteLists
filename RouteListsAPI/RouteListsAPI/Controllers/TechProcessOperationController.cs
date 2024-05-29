using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TechProcessOperationController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public TechProcessOperationController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int techProcessId, int pageNumber = 1, string filter = "")
        {
            var query = _db.TechProcessOperations.Where(x => x.TechProcessId == techProcessId && (
                x.Code.Contains(filter) ||
                x.Name.Contains(filter)))
                .OrderBy(x => x.Position);

            var result = await PagedList<TechProcessOperation>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.TechProcessOperations.FindAsync(id);

            if(item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTechProcessOperationDto dto)
        {
            var operations = new List<Operation>();

            foreach (var id in dto.Ids)
            {
                var operation = await _db.Operations.FindAsync(id);

                if(operation != null)
                    operations.Add(operation);
            }

            foreach(var operation in operations)
            {
                int maxPosition = await _db.TechProcessOperations
                    .Where(x => x.TechProcessId == dto.TechProcessId)
                    .Select(x => x.Position)
                    .DefaultIfEmpty()
                    .MaxAsync();

                _db.TechProcessOperations.Add(new() 
                {
                    TechProcessId = dto.TechProcessId,
                    Code = operation.Code,
                    Name = operation.Name,
                    Type = dto.Type,
                    Description = dto.Description,
                    Count = dto.Count,
                    Department = operation.Department,
                    Position = maxPosition + 1
                });
                
                await _db.SaveChangesAsync();
            }

            await RecalculatePositions(dto.TechProcessId);

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(TechProcessOperation item)
        {
            var original = await _db.TechProcessOperations.FindAsync(item.Id);

            if(original is null)
                return NotFound();

            original.Count = item.Count;
            original.Description = item.Description;
            original.Type = item.Type;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.TechProcessOperations.FindAsync(id);

            if(item is null)
                return NotFound();

            _db.TechProcessOperations.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    
        [HttpPost("Swap")]
        public async Task<IActionResult> Swap(SwapDto dto)
        {
            var item = await _db.TechProcessOperations.FindAsync(dto.Id);
            var item2 = await _db.TechProcessOperations.FindAsync(dto.Id2);

            if(item is null || item2 is null)
                return NotFound();

            (item.Position, item2.Position) = (item2.Position, item.Position);

            await _db.SaveChangesAsync();

            return NoContent();
        }

        private async Task RecalculatePositions(int techProcessId)
        {
            var operations = await _db.TechProcessOperations
                .Where(x => x.TechProcessId == techProcessId)
                .OrderBy(x => x.Position)
                .ToListAsync();

            for (int i = 0; i < operations.Count; i++)
            {
                operations[i].Position = i + 1;
            }

            await _db.SaveChangesAsync();
        }
    }
}