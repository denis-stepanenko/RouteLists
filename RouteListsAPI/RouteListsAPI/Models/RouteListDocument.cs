namespace RouteListsAPI.Models
{
    public class RouteListDocument
    {
        public int Id { get; set; }
        public int RouteListId { get; set; }
        public string Name { get; set; } = "";
    }
}