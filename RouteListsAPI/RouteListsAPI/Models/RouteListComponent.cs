namespace RouteListsAPI.Models
{
    public class RouteListComponent
    {
        public int Id { get; set; }
        public int RouteListId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string? FactoryNumber { get; set; }
        public string? AccompanyingDocument { get; set; }
        public int Count { get; set; }
    }
}