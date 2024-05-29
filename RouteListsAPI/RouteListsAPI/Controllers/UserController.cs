using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [Authorize(Roles="admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserController(UserManager<User> userManager, IPasswordHasher<User> passwordHasher)
        {
            _userManager = userManager;
            _passwordHasher = passwordHasher;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int pageNumber = 1, string filter = "")
        {
            var query = _userManager.Users
                .Where(x =>
                    x.Name.Contains(filter) ||
                    x.Department.ToString().Contains(filter))
                .Select(x => new UserDto {
                    Id = x.Id,
                    Name = x.Name,
                    Department = x.Department,
                    Username = x.UserName ?? ""
                })
                .OrderBy(x => x.Name);

            var result = await PagedList<UserDto>.CreateAsync(query, pageNumber);

            Response.AddPaginationHeader(result.CurrentPage, result.PageSize, result.TotalCount, result.TotalPages);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id) 
        {
            var item = await _userManager.FindByIdAsync(id);

            if(item is null)
                return NotFound();

            var roles = await _userManager.GetRolesAsync(item);

            return Ok(new UserDto 
            {
                Id = item.Id,
                Name = item.Name,
                Department = item.Department,
                Username = item.UserName ?? "",
                Roles = roles.ToList()
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDto dto)
        {
            if(await _userManager.FindByNameAsync(dto.Username) != null)
                return BadRequest("Уже существует пользователь с таким именем пользователя");

            var user = new User
            {
                UserName = dto.Username,
                Name = dto.Name,
                Department = dto.Department
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRolesAsync(user, dto.Roles);

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateUserDto dto)
        {
            var userWithUserName = await _userManager.FindByNameAsync(dto.Username);
            
            if(userWithUserName != null && userWithUserName.Id != dto.Id)
                return BadRequest("Уже существует пользователь с таким именем пользователя");

            var user = await _userManager.FindByIdAsync(dto.Id);

            if (user is null)
                return NotFound();

            user.UserName = dto.Username;
            user.Name = dto.Name;
            user.Department = dto.Department;

            await _userManager.UpdateAsync(user);

            var userRoles = await _userManager.GetRolesAsync(user);

            var addedRoles = dto.Roles.Except(userRoles);

            var removedRoles = userRoles.Except(dto.Roles);

            await _userManager.AddToRolesAsync(user, addedRoles);

            await _userManager.RemoveFromRolesAsync(user, removedRoles);

            return NoContent();
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.Id);

            if (user is null)
                return NotFound();

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);

            await _userManager.UpdateAsync(user);

            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _userManager.FindByIdAsync(id);

            if (item is null)
                return NotFound();

            await _userManager.DeleteAsync(item);

            return NoContent();
        }
    }
}