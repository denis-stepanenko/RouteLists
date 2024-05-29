using RouteListsAPI.Models;

namespace RouteListsAPI.DTOs
{
    public class CreateTechProcessPurchasedProductDto
    {
        public int TechProcessId { get; set; }
        public List<PickingListProduct> Products { get; set; } = [];
    }
}