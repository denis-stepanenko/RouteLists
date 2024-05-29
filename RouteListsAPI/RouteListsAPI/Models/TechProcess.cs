namespace RouteListsAPI.Models
{
    public class TechProcess
    {
        public int Id { get; set; }
        public string ProductCode { get; set; } = "";
        public string ProductName { get; set; } = "";
        public string? Description { get; set; }
        public string? CreatorName { get; set; }
        public string? Picker { get; set; }
        public string? Recipient { get; set; }
        public string? ConfirmUserName { get; set; }
    }
}