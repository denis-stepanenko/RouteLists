namespace RouteListsAPI.Models
{
    public class RouteListRepair
    {
        public int Id { get; set; }
        public int RouteListId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string? Reason { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? Date { get; set; }

        public int ExecutorId { get; set; }
        public Executor? Executor { get; set; }
    }
}