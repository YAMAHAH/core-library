using System.Collections.Generic;
using System.Linq;

namespace DataService.Models
{
    public class BlogViewModel : EntityBase
    {
        public int BlogId { get; set; }
        public string Url { get; set; }
        public string BlogName { get; set; }
        public List<PostViewModel> Posts { get; set; }
    }

    public static class BlogExtention
    {
        // public static BlogViewModel ToViewModel(this Blog source)
        // // {
        // //     return source.ToViewModel<Blog, BlogViewModel>(src => new BlogViewModel()
        // //     {
        // //         BlogId = source.BlogId,
        // //         Url = source.Url,
        // //         BlogName = source.BlogName,
        // //         Posts = source.Posts.Select(p => new PostViewModel()
        // //         {
        // //             PostId = p.PostId,
        // //             Title = p.Title,
        // //             Content = p.Content,
        // //             BlogId = p.BlogId
        // //         }).ToList()
        // //     });
        // }

        // private static List<PostViewModel> ToViewModelList(this Blog source)
        // {
        //     return source.Posts.Select(p => p.ToViewModel()).ToList();
        // }


    }
}