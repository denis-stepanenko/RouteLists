namespace RouteListsAPI.Models
{
    public class RouteListReplacedComponent
    {
        public int Id { get; set; }
        public int RouteListId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string? FactoryNumber { get; set; }
        public string? ReplacementReason { get; set; }
        public DateTime Date { get; set; }
        public int ExecutorId { get; set; }
        public Executor? Executor { get; set; }
    }
}