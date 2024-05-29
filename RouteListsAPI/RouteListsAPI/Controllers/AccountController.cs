using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;
using RouteListsAPI.Services;

namespace RouteListsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(IConfiguration configuration, UserManager<User> userManager, TokenService tokenService)
        {
            _configuration = configuration;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);

            if (user is null)
                return BadRequest("Неправильные имя пользователя или пароль");

            var isCorrectPassword = await _userManager.CheckPasswordAsync(user, dto.Password);

            if (!isCorrectPassword)
                return BadRequest("Неправильные имя пользователя или пароль");

            user.RefreshToken = _tokenService.CreateRefreshToken();
            user.RefreshTokenExpiration = DateTime.Now.AddDays(_configuration.GetValue<int>("RefreshTokenExpirationDays"));

            await _userManager.UpdateAsync(user);

            if(user.UserName is null)
                return BadRequest();

            string photoUrl = "";

            if(user.Photo != null)
                photoUrl = "/account/GetPhoto/" + user.UserName;

            var roles = await _userManager.GetRolesAsync(user);

            var result = new UserDto
            {
                Name = user.Name,
                Department = user.Department,
                Username = user.UserName,
                PhotoUrl = photoUrl,
                Token = _tokenService.CreateToken(user, roles.ToList()),
                RefreshToken = user.RefreshToken,
                Roles = roles.ToList()
            };

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshDto dto)
        {
            ClaimsPrincipal? principal;

            try
            {
                principal = _tokenService.GetPrincipalFromExpiredToken(dto.AccessToken);
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(ex.Message);
            }

            var username = principal?.FindFirst(ClaimTypes.Name)?.Value;

            if (username is null)
                return BadRequest();

            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
                return BadRequest();

            if (user.RefreshToken != dto.RefreshToken)
                return BadRequest();

            if (user.RefreshTokenExpiration < DateTime.Now)
                return BadRequest();

            var roles = await _userManager.GetRolesAsync(user);

            var accessToken = _tokenService.CreateToken(user, roles.ToList());

            user.RefreshToken = _tokenService.CreateRefreshToken();
            user.RefreshTokenExpiration = DateTime.Now.AddDays(_configuration.GetValue<int>("RefreshTokenExpirationDays"));

            await _userManager.UpdateAsync(user);

            var result = new RefreshDto
            {
                AccessToken = accessToken,
                RefreshToken = user.RefreshToken
            };

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            string? userName = User.FindFirstValue(ClaimTypes.Name);
            
            if(userName is null)
                return BadRequest("User has no username");

            var user = await _userManager.FindByNameAsync(userName);

            if(user is null)
                return NotFound();

            string photoUrl = "";

            if(user.Photo != null)
                photoUrl = "/account/GetPhoto/" + user.UserName;

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Name = user.Name,
                Department = user.Department,
                Username = user.UserName!,
                PhotoUrl = photoUrl,
                Roles = roles.ToList()
            });
        }

        [AllowAnonymous]
        [HttpGet("Profile/{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
                return NotFound();

            string photoUrl = "";

            if(user.Photo != null)
                photoUrl = "/account/GetPhoto/" + user.UserName;

            var result = new ProfileDto
            {
                Username = user.UserName!,
                Name = user.Name,
                Department = user.Department,
                PhotoUrl = photoUrl
            };

            return Ok(result);
        }

        [HttpPost("ChangePhoto")]
        public async Task<IActionResult> ChangePhoto(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            if (stream.Length > (1024 * 1024 * 1))
                return BadRequest("File should be less than 1 MB");

            byte[] result = stream.ToArray();
            string contentType = file.ContentType;

            string? userName = User.FindFirstValue(ClaimTypes.Name);

            if(userName is null)
                return BadRequest("User has no username");

            var user = await _userManager.FindByNameAsync(userName);

            if (user is null)
                return NotFound();

            user.Photo = result;
            user.PhotoContentType = contentType;

            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        [HttpDelete("DeletePhoto")]
        public async Task<IActionResult> DeletePhoto()
        {
            string? userName = User.FindFirstValue(ClaimTypes.Name);

            if(userName is null)
                return BadRequest("User has no username");

            var user = await _userManager.FindByNameAsync(userName);

            if(user is null)
                return NotFound();

            user.Photo = null;
            user.PhotoContentType = null;

            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetPhoto/{username}")]
        [Route("GetPhoto/{username}/{random}")]
        public async Task<IActionResult> GetPhoto(string username, string random = "")
        {
            var user = await _userManager.FindByNameAsync(username);

            if(user is null)
                return NotFound();

            if (user.Photo is null || user.PhotoContentType is null)
                return NoContent();

            return File(user.Photo, user.PhotoContentType);
        }
    }
}