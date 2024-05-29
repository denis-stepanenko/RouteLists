namespace RouteListsAPI.DTOs
{
    public class CreateRouteListOperationDto
    {
        public int RouteListId { get; set; }
        public string? Description { get; set; }
        public int Count { get; set; }
        public string? Type { get; set; }
        public string? Number { get; set; }
        public List<int> Ids { get; set; } = [];
    }
}