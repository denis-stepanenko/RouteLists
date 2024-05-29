namespace RouteListsAPI.DTOs
{
    public class CreateTechProcessDto
    {
        public int ProductId { get; set; }
        public int TableId { get; set; }
        public string? Description { get; set; }
    }
}