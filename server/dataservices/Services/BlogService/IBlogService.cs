using System.Collections.Generic;
using System.Linq;
using DataService.Models;
using DataService.ServicesBase;

namespace DataService.Services
{
    public interface IBlogService : IServiceBase
    {
        void InsertBlog(Blog blog);
        void InsertBlogRange(IEnumerable<Blog> blogs);
        void InsertPost(Post post);
        void InsertPostRange(IEnumerable<Post> posts);
        void UpdateBlog(Blog blog);
        void UpdateRangeBlogs(IEnumerable<Blog> blogs);
        IQueryable<Blog> Select();
        ResponseMessage<BlogViewModel> GetBlog(RequestMessage<BlogViewModel> reqModel);
        IEnumerable<Blog> GetAllBlogs();
        ResponseMessage<PostQueryViewModel> GetAllPosts();
        ResponseMessage<BlogViewModel> CreateOrUpdateBlog(RequestMessage<BlogViewModel> reqMsg);
        ResponseMessage<BlogViewModel> CreateOrUpdateBlog2(RequestMessage<BlogViewModel> reqMsg);
    }
}
