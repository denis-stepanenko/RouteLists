namespace RouteListsAPI.Models
{
    public class RouteListOperation
    {
        public int Id { get; set; }
        public int RouteListId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public int Department { get; set; }
        public string? Description { get; set; }
        public decimal Labor { get; set; }
        public int Position { get; set; }
        public int Count { get; set; }
        public string? Type { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Number { get; set; }

        public int? ExecutorId { get; set; }
        public Executor? Executor { get; set; }
    }
}