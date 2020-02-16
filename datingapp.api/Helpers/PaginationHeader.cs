namespace datingapp.api.Helpers
{
    public class PaginationHeader
    {
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public int CurentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public PaginationHeader(int CurentPage, int ItemsPerPage, int TotalItems, int TotalPages)
        {
            this.ItemsPerPage = ItemsPerPage;
            this.CurentPage = CurentPage;
            this.TotalItems = TotalItems;
            this.TotalPages = TotalPages;

        }
    }
}