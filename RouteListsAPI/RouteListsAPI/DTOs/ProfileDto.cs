namespace RouteListsAPI.DTOs
{
    public class ProfileDto
    {
        public string Username { get; set; } = "";
        public string Name { get; set; } = "";
        public int Department { get; set; }
        public string? PhotoUrl { get; set; }
    }
}