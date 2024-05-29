namespace RouteListsAPI.Models
{
    public class TechProcessOperation
    {
        public int Id { get; set; }
        public int TechProcessId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public int Department { get; set; }
        public int Count { get; set; }
        public int Position { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
    }
}