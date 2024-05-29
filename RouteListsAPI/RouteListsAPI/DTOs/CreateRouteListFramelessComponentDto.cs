namespace RouteListsAPI.DTOs
{
    public class CreateRouteListFramelessComponentDto
    {
        public int RouteListId { get; set; }
        public DateTime DateOfIssueForProduction { get; set; }
        public DateTime DateOfSealing { get; set; }
        public int DaysBeforeSealing { get; set; }
        public List<int> Ids { get; set; } = [];
    }
}