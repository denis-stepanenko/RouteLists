namespace RouteListsAPI.DTOs
{
    public class CreateRouteListRepairDto
    {
        public int RouteListId { get; set; }
        public string? Reason { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? Date { get; set; }

        public int ExecutorId { get; set; }
        public List<int> Ids { get; set; } = [];
    }
}