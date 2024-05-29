
namespace RouteListsAPI.DTOs
{
    public class UpdateUserDto
    {
        public string Id { get; set; } = "";
        public string Username { get; set; } = "";
        public string Name { get; set; } = "";
        public int Department { get; set; }
        public List<string> Roles { get; set; } = [];
    }
}