namespace RouteListsAPI.Models
{
    public class RouteList
    {
        public int Id { get; set; }
        public string Number { get; set; } = "";
        public DateTime Date { get; set; }

        public string ProductCode { get; set; } = "";
        public string ProductName { get; set; } = "";
        public int ProductCount { get; set; }
        public string? OwnerProductName { get; set; }
        public bool ESDProtectionRequired { get; set; }

        public string? Route { get; set; }
        public int Department { get; set; }

        public string? GroupName { get; set; }
        public string? Direction { get; set; }
        public string? ClientOrder { get; set; }

        public string? Stage { get; set; }
        public string? FactoryNumber { get; set; }
        public string? PickingListNumber { get; set; }
        public string? Order { get; set; }

        public string? MaterialCode { get; set; }
        public string? MaterialName { get; set; }
        public string? MaterialParameter { get; set; }
        public string? InformationAboutReplacement { get; set; }

        public string? Picker { get; set; }
        public string? Recipient { get; set; }
        public string? PRBWorkerName { get; set; }
        public string? TechnologistName { get; set; }
        public string? MasterName { get; set; }
    }
}