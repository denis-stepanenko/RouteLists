using System.Text.Json;

namespace RouteListsAPI
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {
            var header = new 
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            response.Headers.Append("Pagination", JsonSerializer.Serialize(header));
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }
    }
}