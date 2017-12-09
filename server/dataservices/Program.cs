using System;
using System.Linq;
using DataService;
using DataService.Infrastructure;
using DataService.Infrastructure.UnitOfWork;
using DataService.Models;
using DataService.Services;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ConsoleApplication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            DIService.RegisterService();

            var dbconfig = DIService.ServiceProvider.GetService<IOptions<DatabaseConfig>>();
            // var abc = DIService.services.BuildServiceProvider();
            AppConfig.MasterDatabaseInfo = dbconfig.Value;
            //  new DataService.Infrastructure.DatabaseConfig()
            // {
            //     Name = "cx",
            //     StoreType = StoreType.MySql,
            //     ConnectionString = @"server=localhost;userid=root;pwd=99b3ad6e;port=3306;database=blogdb;sslmode=none;"
            // };
            using (IBlogService blogService = DIService.GetService<IBlogService>())
            {

                Blog blog1 = new Blog();
                blog1.BlogName = "我的个人博客II";
                blog1.Url = "http://www.xyzsoft.com";
                Post post = new Post();
                post.Title = "如何使用EFCore-xyzsoft";
                post.Content = "要想正确使用EFCORE，必须先看文档，了解有哪些东西,然后配合实践，不明白的再看文档";
                blog1.Posts.Add(post);
                blogService.InsertBlog(blog1);

                //blogService.InsertBlog(new Blog() { Url = "http://blogs.msdn.com/adonet", BlogName = "我的博客" });

                var count = blogService.AcceptAllChanges();
                Console.WriteLine("{0} records saved to database", count);
                // Console.WriteLine("All blogs in database:");
                // foreach (var blog in blogService.GetAllBlogs().Where(b => b.BlogId > 0))
                // {
                //     Console.WriteLine(" - {0} - {1}", blog.Url, blog.SiteName);
                // }
            }

            var options = new DbContextOptionsBuilder<DbContextBase>()
                    .UseMySql(new MySqlConnection(AppConfig.MasterDatabaseInfo.ConnectionString))
                .Options;
            using (var context1 = new MySqlContext(options))
            {
                using (var transaction = context1.Database.BeginTransaction())
                {
                    context1.CommittableTransaction = transaction;
                    try
                    {
                        var blog2 = new Blog { Url = "http://blogs.msdn.com/visualstudio", BlogName = "新增的博客" };
                        // var post = context1.Set<Post>().Last();
                        var post = new Post();
                        post.Title = "学习EF CORE";
                        post.Content = "学习EF CORE，必须了解的细节";
                        blog2.Posts.Add(post);
                        // post.BlogId = blog2.BlogId;
                        context1.Add(blog2);
                        //  context1.Set<Blog>().Add(new Blog { BlogName = "单独实例上下文56", Url = "http://blogs.msdn.com/dotnet598" });
                        context1.SaveChanges();

                        using (var context2 = new MySqlContext(options))
                        {
                            // context2.Database.UseTransaction(context1.GetDbTransaction());
                            context2.UseTransaction(context1);
                            var lastblog = context2.Set<Blog>().Last();
                            // context2.Set<Blog>().Remove(lastblog);
                            context2.SaveChanges();

                            var blogs = context2
                            .Set<Blog>()
                            .FromSql("select * from Blog")
                            .Include(b => b.Posts)
                            .Select(blog => new { blog.BlogId, blog.Url, blog.BlogName, blog.Posts })
                            .OrderBy(b => b.Url)
                            .ToList();
                            foreach (var blog in blogs)
                            {
                                Console.WriteLine(" - {0} - {1} - {2}", blog.Url, blog.BlogName, blog.Posts.Count());
                            }
                            // Commit transaction if all commands succeed, transaction will auto-rollback
                            // when disposed if either commands fails
                            transaction.Commit();
                        }
                    }
                    catch (Exception)
                    {
                        // TODO: Handle failure
                    }

                }
            }
            Console.ReadKey();
        }

        private static dynamic toObject(Blog blog)
        {
            dynamic myobj = new System.Dynamic.ExpandoObject();
            myobj.BlogId = blog.BlogId;
            myobj.BlogName = blog.BlogName;
            myobj.Url = blog.Url;
            myobj.Posts = blog.Posts;
            return myobj;
            // 
        }
    }
}
