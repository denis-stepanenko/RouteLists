namespace RouteListsAPI.Models
{
    public class RouteListFramelessComponent
    {
        public int Id { get; set; }
        public int RouteListId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public DateTime DateOfIssueForProduction { get; set; }
        public DateTime DateOfSealing { get; set; }
        public int DaysBeforeSealing { get; set; }
    }
}