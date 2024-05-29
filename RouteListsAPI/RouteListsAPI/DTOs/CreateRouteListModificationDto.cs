using RouteListsAPI.Models;

namespace RouteListsAPI.DTOs
{
    public class CreateRouteListModificationDto
    {
        public int RouteListId { get; set; }
        public string? DocumentNumber { get; set; }

        public int ExecutorId { get; set; }
        public Executor? Executor { get; set; }
        public List<int> Ids { get; set; } = [];
    }
}