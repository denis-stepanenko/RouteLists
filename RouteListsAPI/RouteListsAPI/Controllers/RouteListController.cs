using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteListController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public RouteListController(ApplicationContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.RouteLists.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int? department, int pageNumber = 1, string filter = "")
        {
            var query = _db.RouteLists
                .OrderByDescending(x => x.Id)
                .Where(x =>
                    x.Number.Contains(filter) ||
                    x.ProductCode.Contains(filter) ||
                    x.ProductName.Contains(filter));

            if (department != null)
                query = query.Where(x => x.Department == department);

            var result = await PagedList<RouteList>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(RouteList item)
        {
            _db.RouteLists.Add(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("CreateByTechProcess")]
        public async Task<IActionResult> CreateByTechProcess(CreateRouteListByTechProcessDto dto)
        {
            var techProcess = await _db.TechProcesses.FindAsync(dto.TechProcessId);

            if (techProcess is null)
                return NotFound();

            string? route = await _db.GetProductRouteAsync(techProcess.ProductCode);

            using var transaction = _db.Database.BeginTransaction();

            try
            {
                var routeList = new RouteList
                {
                    Number = dto.Number,
                    Date = dto.Date,
                    ProductCount = dto.ProductCount,
                    Department = dto.Department,
                    ProductCode = techProcess.ProductCode,
                    ProductName = techProcess.ProductName,
                    Picker = techProcess.Picker,
                    Recipient = techProcess.Recipient
                };

                _db.RouteLists.Add(routeList);

                await _db.SaveChangesAsync();

                var operations = await _db.TechProcessOperations
                    .Where(x => x.TechProcessId == dto.TechProcessId)
                    .ToListAsync();

                foreach (var operation in operations)
                {
                    _db.RouteListOperations.Add(new()
                    {
                        RouteListId = routeList.Id,
                        Code = operation.Code,
                        Name = operation.Name,
                        Department = operation.Department,
                        Count = operation.Count,
                        Position = operation.Position,
                        Description = operation.Description,
                        Type = operation.Type
                    });
                }

                var documents = await _db.TechProcessDocuments
                    .Where(x => x.TechProcessId == dto.TechProcessId)
                    .ToListAsync();

                foreach (var document in documents)
                {
                    _db.RouteListDocuments.Add(new()
                    {
                        RouteListId = routeList.Id,
                        Name = document.Name
                    });
                }

                var products = await _db.TechProcessPurchasedProducts
                    .Where(x => x.TechProducessId == dto.TechProcessId)
                    .ToListAsync();

                foreach (var product in products)
                {
                    _db.RouteListComponents.Add(new()
                    {
                        RouteListId = routeList.Id,
                        Code = product.Code,
                        Name = product.Name,
                        Count = (int)product.Count
                    });
                }

                await _db.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }

            return NoContent();
        }

        [HttpGet("Duplicate")]
        public async Task<IActionResult> Duplicate(int id, string newNumber)
        {
            using var transaction = _db.Database.BeginTransaction();

            try
            {
                var routeList = await _db.RouteLists.FindAsync(id);

                if (routeList is null)
                    return NotFound();

                _db.Entry(routeList).State = EntityState.Detached;

                routeList.Id = 0;

                routeList.Number = newNumber;

                _db.RouteLists.Add(routeList);

                await _db.SaveChangesAsync();

                // Операции
                var operations = await _db.RouteListOperations
                    .Where(x => x.RouteListId == id)
                    .AsNoTracking()
                    .ToListAsync();

                operations.ForEach(x =>
                {
                    x.Id = 0;
                    x.RouteListId = routeList.Id;
                });

                _db.RouteListOperations.AddRange(operations);

                // Документы
                var documents = await _db.RouteListDocuments
                    .Where(x => x.RouteListId == id)
                    .AsNoTracking()
                    .ToListAsync();

                documents.ForEach(x =>
                {
                    x.Id = 0;
                    x.RouteListId = routeList.Id;
                });

                _db.RouteListDocuments.AddRange(documents);

                // Бескорпусные комплектующие
                var framelessComponents = await _db.RouteListFramelessComponents
                    .Where(x => x.RouteListId == id)
                    .AsNoTracking()
                    .ToListAsync();

                framelessComponents.ForEach(x =>
                {
                    x.Id = 0;
                    x.RouteListId = routeList.Id;
                });

                _db.RouteListFramelessComponents.AddRange(framelessComponents);

                // Замена комплектующих
                var replacedComponents = await _db.RouteListReplacedComponents
                    .Where(x => x.RouteListId == id)
                    .AsNoTracking()
                    .ToListAsync();

                replacedComponents.ForEach(x =>
                {
                    x.Id = 0;
                    x.RouteListId = routeList.Id;
                });

                _db.RouteListReplacedComponents.AddRange(replacedComponents);

                // Комплектация изделия
                var components = await _db.RouteListComponents
                    .Where(x => x.RouteListId == id)
                    .AsNoTracking()
                    .ToListAsync();

                components.ForEach(x =>
                {
                    x.Id = 0;
                    x.RouteListId = routeList.Id;
                });

                _db.RouteListComponents.AddRange(components);

                await _db.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(RouteList item)
        {
            _db.Update(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.RouteLists.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.RouteLists.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("GetNewNumber")]
        public async Task<IActionResult> GetNewNumber(int department)
        {
            var newNumber = await _db.GetNewRouteListNumberAsync(department);

            return Ok(newNumber);
        }
    }
}