using Microsoft.AspNetCore.Identity;

namespace RouteListsAPI.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; } = "";
        public int Department { get; set; }
        public byte[]? Photo { get; set; }
        public string? PhotoContentType { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiration { get; set; }
    }
}