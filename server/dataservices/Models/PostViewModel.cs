using System;

namespace DataService.Models
{
    public class PostViewModel : EntityBase
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int BlogId { get; set; }
    }
    public static class PostExtention
    {
    //     public static PostViewModel ToViewModel(this Post post)
    //     {
    //         return new PostViewModel()
    //         {
    //             PostId = post.PostId,
    //             Title = post.Title,
    //             Content = post.Content,
    //             BlogId = post.BlogId
    //         };
    //     }

    //     public static dest ToModel<src, dest>(this src source, Func<src, dest> action) where src : EntityBase
    //     {
    //         return action.Invoke(source);
    //     }
    //     public static dest ToViewModel<src, dest>(this src source, Func<src, dest> action) where src : EntityBase
    //     {
    //         return action.Invoke(source);
    //     }
    //     public static dest ToModelList<src, dest>(this src source, Func<src, dest> action) where src : EntityBase
    //     {
    //         return action.Invoke(source);
    //     }
    //     public static dest ToViewModelList<src, dest>(this src source, Func<src, dest> action) where src : EntityBase
    //     {
    //         return action.Invoke(source);
    //     }

    }
}