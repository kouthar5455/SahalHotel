namespace HotelBookingAPI.Helpers
{
    /// <summary>
    /// Opt-in pagination: when a client supplies <c>page</c>/<c>pageSize</c> the query is
    /// windowed with Skip/Take; when both are omitted the full (previously-returned) result
    /// set is preserved so existing callers keep working. <c>pageSize</c> is clamped to a
    /// sane maximum to bound memory usage.
    /// </summary>
    public static class QueryablePaginationExtensions
    {
        public const int MaxPageSize = 100;

        public static IQueryable<T> Paginate<T>(this IQueryable<T> query, int? page, int? pageSize)
        {
            if (!page.HasValue && !pageSize.HasValue)
                return query;

            var p = page.GetValueOrDefault(1);
            if (p < 1) p = 1;

            var size = pageSize.GetValueOrDefault(20);
            if (size < 1) size = 1;
            if (size > MaxPageSize) size = MaxPageSize;

            return query.Skip((p - 1) * size).Take(size);
        }
    }
}
