using System;
using System.Collections.Generic;
using System.Linq;
using DataService.Extensions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DataService.Infrastructure;
using DataService.Infrastructure.UnitOfWork;
using DataService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DataService.Services
{
    public class BlogService : ServiceBase, IBlogService
    {
        private PostService postService = null;
        protected PostService PostService
        {
            get
            {
                if (postService == null)
                {
                    this.postService = new PostService(base.UnitOfWork);
                }
                return postService;
            }
        }
        public BlogService() : base(null)
        {

        }

        public BlogService(IUnitOfWork unitOfWork, bool shareTransaction = false)
        : base(unitOfWork, shareTransaction)
        {
        }
        public void InsertBlog(Blog blog)
        {
            //var str = JsonService.SerializeObject(blog);
            UnitOfWork.DbContext.Add(blog);
            throw new Exception("没有数据权限,请与管理员联系!");
            var myuow = UnitFactoryService.GetUnitOfWork(this.UnitOfWork);
            myuow.DbContext.Add(new Blog() { Url = "http://blogs.msdn.com/adonet5678", BlogName = "我的博客-上下文" });
            myuow.DbContext.SaveChanges();
            //             var blogs = UnitOfWork.Repository.Set<Blog>()
            //             .FromSql("EXECUTE dbo.GetMostPopularBlogsForUser @user", user)
            // .ToList();

        }
        public void InsertPost(Post post)
        {
            UnitOfWork.DbContext.Add(post);
        }
        public void InsertBlogRange(IEnumerable<Blog> blogs)
        {
            UnitOfWork.DbContext.AddRange(blogs);
        }
        public void InsertPostRange(IEnumerable<Post> posts)
        {
            postService.InsertRange(posts);

        }
        public IQueryable<Blog> Select()
        {
            return EntitySet<Blog>().AsQueryable();
        }

        //service Model ==  APi MOODEL
        public void UpdateBlog(Blog blog) //APIMODEL
        {
            var str = JsonService.SerializeObject(blog);
            //APIMODEL -> MODEL  RESULT ->APIMODEL
            UnitOfWork.DbContext.Update(blog);
        }

        public void UpdateRangeBlogs(IEnumerable<Blog> blogs)
        {

        }

        public IEnumerable<Blog> GetAllBlogs()
        {
            // List<Blog> blogs = Select().ToList();
            List<Blog> blogs = UnitOfWork.DbContext
                            .Set<Blog>()
                            .FromSql("select a.BlogId,a.BlogName,a.Url,b.Content,b.Title from Blogs as a inner join Post as b on a.BlogId = b.BlogId")
                            .ToList();
            // blogs.ForEach(b => b.SiteName );
            return blogs;
        }

        public ResponseMessage<PostQueryViewModel> GetAllPosts()
        {
            // List<BlogViewModel> blogs = 
            //    var a = UnitOfWork
            //     .DbContext.Database.GetDbConnection().CreateCommand().ex
            //     .Set().FromSql("abc");
            //     .ExecuteSqlCommand("select a.BlogId,a.BlogName,a.Url,b.Content,b.Title from Post as b  inner join Blogs as a on a.BlogId = b.BlogId");
            //     // a.Url,b.Content,b.Title from Blogs as a inner join Post as b on a.BlogId = b.BlogId")
            try
            {
                var aa = UnitOfWork.DbContext.Set<Post>().AsNoTracking()
             .FromSql("CALL GetAllPosts({0});", "a.BlogId >= 568")
             .ToList();
                System.Console.WriteLine("Count:" + aa.Count().ToString());
            }
            catch (System.Exception ex)
            {

                System.Console.WriteLine(ex.InnerException.Message);
            }
            //mysql 分页
            // 当前页码×页面容量-1,页面容量
            var resModel = new ResponseMessage<PostQueryViewModel>();
            var vm = UnitOfWork
              .DbContext
              .Set<Post>().AsNoTracking()
             .FromSql("select * from GetPosts where BlogId > 488 and Url like 'http://%' limit 59,20 ")
              //.FromSql("select b.* from Post as b where b.BlogId >=427")
              //.FromSql("CALL GetAllPosts({0});", "a.BlogId >=568 and b.Url like 'http://%'")
              //.FromSql("call GetAllPosts1")
              .Select(b => b.Map((p) => new PostQueryViewModel()
              {
                  BlogId = b.BlogId,
                  BlogName = b.Blog.BlogName,
                  Url = b.Blog.Url,
                  Title = b.Title,
                  Content = b.Content
              })).ToList();
            resModel.Playload = vm;
            resModel.ReturnMessages.Add("成功获取Blogs数据");
            resModel.ReturnStatus = true;

            return resModel;
        }
        public Func<Blog, BlogViewModel> ToBlogViewModel { get; } = (source) =>
        {
            return new BlogViewModel()
            {
                BlogId = source.BlogId,
                Url = source.Url,
                BlogName = source.BlogName,
                Posts = source.Map((src) => src.Posts.Select(p => new PostViewModel()
                {
                    PostId = p.PostId,
                    Title = p.Title,
                    Content = p.Content,
                    BlogId = p.BlogId
                }).ToList())
            };
        };

        public ResponseMessage<BlogViewModel> GetBlog(RequestMessage<BlogViewModel> reqModel)
        {
            Mapper.Initialize(cfg =>
          {
              cfg.CreateMap<Blog, BlogViewModel>();
              cfg.CreateMap<Post, PostViewModel>();
          });
            // var resModel = new ResponseMessage<BlogViewModel>();
            var vm = UnitOfWork.DbContext
              .Set<Blog>().AsNoTracking()
              .FromSql("select * from Blog where " + reqModel.FilterExp)
              //.Include(b => b.Posts)
              .ProjectTo<BlogViewModel>()
              // .Select(b => Mapper.Map<BlogViewModel>(b))    //b.Map(ToBlogViewModel)
              .FirstOrDefault();
            return okResponse(vm);
            // resModel.ReturnStatus = true;
            // resModel.Playload.Add(vm);
            // return resModel;
        }
        public ResponseMessage<BlogViewModel> CreateOrUpdateBlog(RequestMessage<BlogViewModel> reqMsg)
        {
            var context = UnitOfWork.DbContext;
            var blogViewModel = reqMsg.Playload.FirstOrDefault();
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<BlogViewModel, Blog>().ConstructUsing((BlogViewModel Blog) =>
              {
                  if (blogViewModel.BlogId == 0)
                  {
                      var blog = new Blog(); context.Set<Blog>().Add(blog);
                      return blog;
                  }
                  return context.Set<Blog>().Include(b => b.Posts).First(b => b.BlogId == blogViewModel.BlogId);
              }).BeforeMap((bViewModel, b) =>
              {
                  b.Posts
                  .Where(d => !bViewModel.Posts.Any(ddto => ddto.PostId == d.PostId))
                  .ToList()
                  .ForEach(deleted => context.Set<Post>().Remove(deleted));
              });
                cfg.CreateMap<PostViewModel, Post>()
                 .ConstructUsing((PostViewModel post) =>
                 {
                     if (post.PostId == 0) return new Post();
                     return context.Set<Post>().First(d => d.PostId == post.PostId);
                 });
                cfg.CreateMap<Blog, BlogViewModel>();
                cfg.CreateMap<Post, PostViewModel>();
            });
            var bmodel = Mapper.Map<BlogViewModel, Blog>(blogViewModel);
            AcceptAllChanges();
            return okResponse(Mapper.Map<BlogViewModel>(bmodel));
        }

        public ResponseMessage<BlogViewModel> CreateOrUpdateBlog2(RequestMessage<BlogViewModel> reqMsg)
        {
            var blogViewModel = reqMsg.Playload.FirstOrDefault();
            var dbContext = UnitOfWork.DbContext;
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<BlogViewModel, Blog>();
                cfg.CreateMap<PostViewModel, Post>();
                cfg.CreateMap<Blog, BlogViewModel>();
                cfg.CreateMap<Post, PostViewModel>();
            });

            var newBlog = Mapper.Map<BlogViewModel, Blog>(blogViewModel);
            if (newBlog.BlogId == 0)
            {
                dbContext.Add(newBlog);
            }
            else
            {
                //获取最新
                var existingEntity = UnitOfWork.EntitySet<Blog>()
                .Include(b => b.Posts)
                .Where(b => b.BlogId == newBlog.BlogId)
                .FirstOrDefault();
                //更新
                // UpdateBlog(existingEntity, newBlog);
                UnitOfWork.UpdateValues(existingEntity, newBlog, b => b.Posts, p => p.PostId, (p1, p2) => p1.PostId == p2.PostId);
                // SetEntityValues(existingEntity, newBlog);
                // var entityDiff = new EntityDiff<Post, int>(existingEntity.Posts, newBlog.Posts, p => p.PostId);
                // DeleteEntities(entityDiff.DeletedEntities);
                // AddEntities(existingEntity.Posts, entityDiff.AddedEntities);
                // UpdateEntities(existingEntity.Posts, entityDiff.ModifiedEntities, (p1, p2) => p1.PostId == p2.PostId);

                newBlog = existingEntity;
            }
            AcceptAllChanges();
            return okResponse(Mapper.Map<BlogViewModel>(newBlog));
        }

        // private ResponseMessage<T> okResponse<T>(T resultObject)
        // {
        //     var resMsg = new ResponseMessage<T>();
        //     resMsg.ReturnStatus = true;
        //     resMsg.Playload.Add(Mapper.Map<T>(resultObject));
        //     return resMsg;
        // }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="oldBlog"></param>
        /// <param name="newBlog"></param>
        // public void UpdateBlog(Blog oldBlog, Blog newBlog)
        // {
        //     // SetEntityValues(oldBlog, newBlog);
        //     // var entityDiff = new EntityDiff<Post, int>(oldBlog.Posts, newBlog.Posts, p => p.PostId);
        //     // DeleteEntities(entityDiff.DeletedEntities);
        //     // AddEntities(oldBlog.Posts, entityDiff.AddedEntities);
        //     // UpdateEntities(oldBlog.Posts, entityDiff.ModifiedEntities, (p1, p2) => p1.PostId == p2.PostId);
        //     UpdateValues(oldBlog, newBlog, b => b.Posts, p => p.PostId, (p1, p2) => p1.PostId == p2.PostId);
        //     // UnitOfWork.DbContext.Entry(oldBlog).CurrentValues.SetValues(newBlog);
        //     // entityDiff.DeletedEntities.ForEach(p => DeleteEntity(p));
        //     // var existEntries = oldBlog.Posts;
        //     // var updateEntries = newBlog.Posts;
        //     // var addedEntryies = updateEntries.Except(existEntries, p => p.PostId);
        //     // var deletedEntryies = existEntries.Except(updateEntries, p => p.PostId);
        //     // var modifiedEntries = updateEntries.Except(addedEntryies, p => p.PostId);
        //     // oldBlog.Posts.AddRange(entityDiff.AddedEntities);

        //     // foreach (var newPost in entityDiff.ModifiedEntities)
        //     // {
        //     //     var oldPost = existEntries.Where(p => p.PostId == newPost.PostId).FirstOrDefault();
        //     //     UnitOfWork.DbContext.Entry(oldPost).CurrentValues.SetValues(newPost);
        //     // }
        // }

        /// <summary>
        /// 更新1对多关系的实体值
        /// </summary>
        ///<param name="existEntity">数据库存在的实体</param>
        ///<param name="nowEntity">当前存在的实体</param>
        ///<param name="getChilds">获取1对多关系的实体回调</param>
        ///<param name="getCompareKey">实体差异比较条件回调</param>
        ///<param name="getKey">实体更新获取数据库实体的条件回调</param>
        /// <returns>VOID/returns>
        // private void UpdateValues<T, T1, TKey>(T existEntity, T nowEntity, Func<T, List<T1>> getChilds,
        //  Func<T1, TKey> getCompareKey, Func<T1, T1, bool> getKey) where T : EntityBase where T1 : EntityBase
        // {
        //     SetEntityValues(existEntity, nowEntity);
        //     var entityDiff = new EntityDiff<T1, TKey>(getChilds(existEntity), getChilds(nowEntity), getCompareKey);
        //     // DeleteEntities(entityDiff.DeletedEntities);
        //     entityDiff.DeletedEntities.ForEach(p => SetEntityState(p, EntityState.Deleted));
        //     //   AddEntities(getChilds(existEntity), entityDiff.AddedEntities);
        //     getChilds(existEntity).AddRange(entityDiff.AddedEntities);
        //     //  UpdateEntities(getChilds(existEntity), entityDiff.ModifiedEntities, getEntityKey);
        //     foreach (var newPost in entityDiff.ModifiedEntities)
        //     {
        //         var oldPost = getChilds(existEntity).Where(p => getKey(newPost, p)).FirstOrDefault();
        //         SetEntityValues(oldPost, newPost);
        //     }
        // }

        // private void UpdateValues<T>(T existEntity, T nowEntity) where T : EntityBase
        // {
        //     SetEntityValues(existEntity, nowEntity);
        // }

        // private T GetByKeyReadOnly<T>(Func<T, bool> getKey) where T : EntityBase
        // {
        //     return UnitOfWork.DbContext.Set<T>().AsNoTracking().FirstOrDefault(getKey);
        // }
        // private T GetByKey<T>(object key) where T : EntityBase
        // {
        //     return UnitOfWork.DbContext.Set<T>().Find(key);
        // }
        // private object GetByKey(Type type, object key)
        // {
        //     return UnitOfWork.DbContext.Find(type, key);
        // }
        /// <summary>
        /// 使用当前实体值去更新数据库对应的实体值
        /// </summary>
        ///<param name="entity">数据库存在的实体</param>
        ///<param name="nowEntity">当前的实体</param>
        /// <returns>Void</returns>
        // private void SetEntityValues<T>(T existEntity, T nowEntity) where T : EntityBase
        // {
        //     UnitOfWork.DbContext.Entry(existEntity).CurrentValues.SetValues(nowEntity);
        // }
        // /// <summary>
        // /// 设置实体状态
        // /// </summary>
        // ///<param name="entity">设置的实体</param>
        // ///<param name="entityState">设置实体的状态</param>
        // /// <returns>Void</returns>
        // private void SetEntityState<T>(T entity, EntityState entityState) where T : EntityBase
        // {
        //     UnitOfWork.DbContext.Entry(entity).State = entityState;
        // }
        private void AddEntities<T>(List<T> existEntities, List<T> addEntities)
        {
            existEntities.AddRange(addEntities);
        }
        private void DeleteEntities<T>(List<T> deletedEntities) where T : EntityBase
        {
            deletedEntities.ForEach(p => UnitOfWork.DbContext.Entry(p).State = EntityState.Deleted);
        }
        private void UpdateEntities<T>(List<T> existEntries, List<T> modifiedEntities, Func<T, T, bool> getKey) where T : EntityBase
        {
            foreach (var newPost in modifiedEntities)
            {
                var oldPost = existEntries.Where(p => getKey(newPost, p)).FirstOrDefault();
                UnitOfWork.UpdateEntityValues(oldPost, newPost);
            }
        }
    }
}
