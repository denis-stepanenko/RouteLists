namespace RouteListsAPI.Models
{
    public class Operation
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string? GroupName { get; set; }
        public int Department { get; set; }
    }
}