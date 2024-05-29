namespace RouteListsAPI.DTOs
{
    public class CreateRouteListReplacedComponentDto
    {
        public int RouteListId { get; set; }
        public string? FactoryNumber { get; set; }
        public string? ReplacementReason { get; set; }
        public DateTime Date { get; set; }
        public int ExecutorId { get; set; }
        public List<ProductDto> Products { get; set; } = [];
    }
}