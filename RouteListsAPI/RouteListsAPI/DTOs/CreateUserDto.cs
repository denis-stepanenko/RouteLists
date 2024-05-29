namespace RouteListsAPI.DTOs
{
    public class CreateUserDto
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string Name { get; set; } = "";
        public int Department { get; set; }
        public List<string> Roles { get; set; } = [];
    }
}