using System.Collections.Generic;
using DataService.Infrastructure.UnitOfWork;
using DataService.Models;

namespace DataService.Services
{
    public class PostService : ServiceBase
    {
        public PostService() : this(null)
        {

        }
        public PostService(IUnitOfWork unitOfWork, bool shareTransaction = false)
        : base(unitOfWork, shareTransaction)
        { }

        public void Insert(Post post)
        {
            UnitOfWork.DbContext.Add(post);
        }
        public void InsertRange(IEnumerable<Post> Posts)
        {
            UnitOfWork.DbContext.AddRange(Posts);
        }
    }
}
