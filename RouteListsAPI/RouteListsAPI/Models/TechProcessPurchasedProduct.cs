namespace RouteListsAPI.Models
{
    public class TechProcessPurchasedProduct
    {
        public int Id { get; set; }
        public int TechProducessId { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public decimal Count { get; set; }
    }
}