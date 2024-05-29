using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int pageNumber = 1, string filter = "") 
        {
            var query = _roleManager.Roles
                .Where(x => (x.Name ?? "").Contains(filter))
                .OrderBy(x => x.Name);

            var result = await PagedList<IdentityRole>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> Get()
        {
            var items = await _roleManager.Roles.ToListAsync();

            return Ok(items);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> Get(string id)
            => Ok(await _roleManager.FindByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Create(CreateRoleDto dto)
        {
            if(await _roleManager.FindByNameAsync(dto.Name) != null)
                return BadRequest("Уже существует роль с таким именем");

            await _roleManager.CreateAsync(new IdentityRole { Name = dto.Name });

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateRoleDto dto)
        {
            var roleWithName = await _roleManager.FindByNameAsync(dto.Name);

            if(roleWithName != null && roleWithName.Id != dto.Id)
                return BadRequest("Уже существует роль с таким именем");

            var role = await _roleManager.FindByIdAsync(dto.Id);

            if (role is null)
                return NotFound();

            role.Name = dto.Name;

            await _roleManager.UpdateAsync(role);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            if(role is null)
                return NotFound();

            await _roleManager.DeleteAsync(role);

            return NoContent();
        }
    }
}