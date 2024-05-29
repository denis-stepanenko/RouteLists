namespace RouteListsAPI.DTOs
{
    public class CreateRouteListComponentDto
    {
        public int RouteListId { get; set; }
        public string? FactoryNumber { get; set; }
        public string? AccompanyingDocument { get; set; }
        public int Count { get; set; }
        public List<ProductDto> Products { get; set; } = [];
    }
}