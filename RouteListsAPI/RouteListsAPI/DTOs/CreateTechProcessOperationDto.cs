namespace RouteListsAPI.DTOs
{
    public class CreateTechProcessOperationDto
    {
        public int TechProcessId { get; set; }
        public int Count { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public List<int> Ids { get; set; } = [];
    }
}