using System.ComponentModel.DataAnnotations.Schema;

namespace RouteListsAPI.Models
{
    public class PickingListProduct
    {
        [Column("Decnum")]
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        [Column("CountAll")]
        public decimal Count { get; set; }
    }
}