using Microsoft.EntityFrameworkCore;

namespace RouteListsAPI
{
    public class PagedList<T> : List<T>
    {
        private const int pageSize = 50;
        public PagedList(IEnumerable<T> items, int count, int pageNumber)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize).ToListAsync();

            return new PagedList<T>(items, count, pageNumber);
        }
    }
}