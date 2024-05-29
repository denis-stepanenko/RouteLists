namespace RouteListsAPI.Models
{
    public class Material
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string? Parameter { get; set; }
    }
}