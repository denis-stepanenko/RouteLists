namespace RouteListsAPI.DTOs
{
    public class CreateRouteListByTechProcessDto
    {
        public required string Number { get; set; }
        public DateTime Date { get; set; }
        public int ProductCount { get; set; }
        public int Department { get; set; }
        public int TechProcessId { get; set; }
    }
}