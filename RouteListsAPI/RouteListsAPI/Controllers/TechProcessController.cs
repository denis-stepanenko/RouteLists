using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TechProcessController : ControllerBase
    {
        private readonly ApplicationContext _db;
        private readonly UserManager<User> _userManager;

        public TechProcessController(ApplicationContext db, UserManager<User> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(int pageNumber = 1, string filter = "")
        {
            var query = _db.TechProcesses
                .Where(x =>
                    x.ProductCode.Contains(filter) ||
                    x.ProductName.Contains(filter) ||
                    (x.Description ?? "").Contains(filter))
                .OrderByDescending(x => x.Id);

            var result = await PagedList<TechProcess>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.TechProcesses.FindAsync(id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpGet("Find")]
        public async Task<IActionResult> Find(string filter = "")
        {
            var items = await _db.TechProcesses
                .Where(x => 
                    x.ProductCode.Contains(filter) ||
                    x.ProductName.Contains(filter) ||
                    (x.Description ?? "").Contains(filter))
                .Take(50)
                .ToListAsync();
    
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTechProcessDto dto)
        {
            var product = await _db.OwnProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name, TableId = 2 })
              .Union(_db.PurchasedProducts.Select(x => new ProductDto { Id = x.Id, Code = x.Code, Name = x.Name ?? "", TableId = 1 }))
              .FirstOrDefaultAsync(x => x.Id == dto.ProductId && x.TableId == dto.TableId);

            if (product is null)
                return NotFound();

            string? username = User.FindFirstValue(ClaimTypes.Name);

            if(username is null)
                return BadRequest("User has no username");
                
            var user = await _userManager.FindByNameAsync(username);

            if(user is null)
                return NotFound("User is not found");

            _db.TechProcesses.Add(new()
            {
                ProductCode = product.Code,
                ProductName = product.Name,
                Description = dto.Description,
                CreatorName = user.Name
            });

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(TechProcess item)
        {
            var original = await _db.TechProcesses.FindAsync(item.Id);

            if(original is null)
                return NotFound();

            original.Description = item.Description;
            original.Picker = item.Picker;
            original.Recipient = item.Picker;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.TechProcesses.FindAsync(id);

            if (item is null)
                return NotFound();

            _db.TechProcesses.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("ConfirmOrUnconfirm/{id}")]
        public async Task<IActionResult> ConfirmOrUnconfirm(int id)
        {
            var item = await _db.TechProcesses.FindAsync(id);

            if (item is null)
                return NotFound();

            string? username = User.FindFirstValue(ClaimTypes.Name);

            if(username is null)
                return BadRequest("User has no username");

            var user = await _userManager.FindByNameAsync(username);

            if(user is null)
                return NotFound("User is not found");

            if (string.IsNullOrEmpty(item.ConfirmUserName))
            {
                item.ConfirmUserName = user.Name;
            }
            else if (item.ConfirmUserName == user.Name)
            {
                item.ConfirmUserName = null;
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}