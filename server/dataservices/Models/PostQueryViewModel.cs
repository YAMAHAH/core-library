namespace DataService.Models
{
    public class PostQueryViewModel : EntityBase
    {
        public int PostId { get; set; }
        public int BlogId { get; set; }
        public string BlogName { get; set; }
        public string Url { get; set; }
        public string Content { get; set; }
        public string Title { get; set; }
    }
}