namespace RouteListsAPI.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = "";
        public string Username { get; set; } = "";
        public string Name { get; set; } = "";
        public int Department { get; set; }
        public string PhotoUrl { get; set; } = "";
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public List<string> Roles { get; set; } = [];
    }
}