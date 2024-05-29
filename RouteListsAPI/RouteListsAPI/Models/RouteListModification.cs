namespace RouteListsAPI.Models
{
    public class RouteListModification
    {
        public int Id { get; set; }
        public int RouteListId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string? DocumentNumber { get; set; }

        public int ExecutorId { get; set; }
        public Executor? Executor { get; set; }
    }
}