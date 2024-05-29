namespace RouteListsAPI.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public required string Code { get; set; }
        public required string Name { get; set; }
    }
}