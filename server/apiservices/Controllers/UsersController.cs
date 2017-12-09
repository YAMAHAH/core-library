using System;
using ApiService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using DataService.Services;
using DataService.Models;
using DataService.Infrastructure;
using DataService;
using System.IO;
using System.Linq;
using dataservices.Services.ReportService;
using System.Text;
using System.Collections.Generic;

namespace ApiService.Controllers
{
    [Authorize]
    [EnableCors("defaultCors")]
    [Route("api/[controller]/[action]")]
    // [ServiceFilter(typeof(MyActionServiceFilter))]
    // [MyActionFilter(null)]
    public class UsersController : Controller
    {
        // [Injection]
        private ILogger<UsersController> _logger;
        // private IBlogService blogService;

        public UsersController(ILogger<UsersController> logger)
        {
            this._logger = logger;

        }

        public IActionResult Login([FromBody]User user)
        {
            return RedirectToRoute("/api/token", "");
        }


        // [EnableCors("defaultCors")]
        [HttpGet("{id}")]
        //  [TypeFilter(typeof(MyActionTypeFilter), Arguments = new object[] { "typefilter", "MyTypeFilterAction" })]
        public IActionResult Get(int id)
        {
            // _logger.LogInformation("This is Information Log!");
            // _logger.LogWarning("This is a Warning Log!");
            // _logger.LogError("This is a Error log!");
            try
            {
                //DIService.GetService<IBlogService>()
                // Console.WriteLine(this.HttpContext.RequestServices.GetService(typeof(IBlogService)));
                var user = new User() { Id = id, Name = "Name:" + id, Sex = "Male" };
                // this._logger.LogInformation(Json(user).ToString());

                using (IBlogService blogService = DIService.GetService<IBlogService>())
                {
                    Blog blog1 = new Blog
                    {
                        BlogName = "我的个人博客II",
                        Url = "http://www.xyzsoft.com"
                    };
                    Post post = new Post
                    {
                        Title = "如何使用EFCore-xyzsoft",
                        Content = "要想正确使用EFCORE，必须先看文档，了解有哪些东西,然后配合实践，不明白的再看文档"
                    };
                    blog1.Posts.Add(post);
                    blogService.InsertBlog(blog1);
                    var count = blogService.AcceptAllChanges();
                    ResponseMessage<PostQueryViewModel> posts = blogService.GetAllPosts();
                    return new ObjectResult(JsonService.SerializeObject(posts));
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
                // return new ObjectResult(ex.Message);
            }
            //  Console.WriteLine(ex.Message);
            //                // this._logger.LogError(ex.InnerException.Message);
            //                 // var jsonstr = "{ message22:" + ex.InnerException.Message + " }";
            //                 // Console.WriteLine(jsonstr);

        }
        [HttpGet()]
        public IActionResult GetPdf()
        {
            var filePath = "wwwroot/MaterialPreparation.pdf"; //  aspnet-ef-latest.pdf"MaterialPreparation.pdf; //aspnet-ef-latest.pdfServer.MapPath(System.Configuration.ConfigurationManager.AppSettings["AttachmentPath"] + filePath);
            FileStream fs = new FileStream(filePath, FileMode.Open);

            //  Response.Headers.Add("Content-Disposition", "attachment;fileName=test.pdf");
            // Response.ContentType = "multipart/form-data";
            // byte[] bytes = new byte[(int)fs.Length];
            // fs.Read(bytes, 0, bytes.Length);
            // fs.close();
            // Response.Headers["charset"] = "UTF-8";
            // // Response.Headers["ContentEncoding"] = Encoding.GetEncoding("UTF-8");
            // // Response.ContentType = "application/octet-stream"; attachment

            //  Response.Headers.Add("Content-Disposition", "inline; filename=" + "abc.pdf");
            //new ObjectResult(JsonService.SerializeObject(new Blog() { BlogId = 132, BlogName = "abc", Url = "http://xyz" }));
            // throw new Exception("GetAll function failed!!");

            //File file = new File("F:/资料/pdf/JVM基础.pdf");
            //FileInputStream fileInputStream = new FileInputStream(file);
            //response.setHeader("Content-Disposition", "attachment;fileName=test.pdf");
            //response.setContentType("multipart/form-data");
            //OutputStream outputStream = response.getOutputStream();
            //IOUtils.write(IOUtils.toByteArray(fileInputStream), outputStream);application/pdf


            byte[] fsbyte = new byte[fs.Length];
            fs.Read(fsbyte, 0, fsbyte.Length);
            fs.Flush();

            string base64Str = Convert.ToBase64String(fsbyte);
            // File(fs, "application/pdf");
            fs.Dispose();
            return Content(base64Str, "text/plain");  //File(fs, "multipart/form-data");
        }

        [HttpGet()]
        public IActionResult GetBlobPdf()
        {
            var filePath = "wwwroot/aspnet-ef-latest.pdf";
            FileStream fs = new FileStream(filePath, FileMode.Open);

            //Response.Headers.Add("Content-Disposition", "attachment;fileName=test.pdf");
            //Response..HeaderEncoding = Encoding.Default;
            // Response.Headers.Add("Content-Transfer-Encoding", "binary");
            //byte[] fsbyte = new byte[fs.Length];
            //fs.Read(fsbyte, 0, fsbyte.Length);
            //fs.Flush();
            //fs.Dispose();
            return File(fs, "application/pdf");

        }
        class TestData
        {
            public string name;
            public string email;
            public string phone;
        }

        [HttpGet()]
        public IActionResult GetTestJSON()
        {
            var testData = new List<dynamic>(){
            new TestData(){
                name= "John Doe",
                email= "john@doe.com",
                phone= "111-111-1111"
            },
            new TestData() {
                name = "Barry Allen",
                email = "barry@flash.com",
                phone = "222-222-2222"
            },
             new TestData(){
                name= "Cool Dude",
                email = "cool@dude.com",
                phone = "333-333-3333"
            },
             new TestData(){
                name= "John Doe",
                email= "john@doe.com",
                phone= "111-111-1111"
            },
            new TestData() {
                name = "Barry Allen",
                email = "barry@flash.com",
                phone = "222-222-2222"
            },
             new TestData(){
                name= "Cool Dude",
                email = "cool@dude.com",
                phone = "333-333-3333"
            }, new TestData(){
                name= "John Doe",
                email= "john@doe.com",
                phone= "111-111-1111"
            },
            new TestData() {
                name = "Barry Allen",
                email = "barry@flash.com",
                phone = "222-222-2222"
            },
             new TestData(){
                name= "Cool Dude",
                email = "cool@dude.com",
                phone = "333-333-3333"
            }};
            return Json(testData);
        }

        [HttpGet()]
        public IActionResult GetTestImage()
        {
            return File("wwwroot/wm.jpg", "image/jpeg");
        }

        [HttpGet()]
        public IActionResult GetTestImage2()
        {
            var filePath = "wwwroot/wm.jpg";
            FileStream fs = new FileStream(filePath, FileMode.Open);
            return File(fs, "image/jpeg");
        }

        [HttpPost()]
        public IActionResult GetBlog([FromBody]RequestMessage<BlogViewModel> reqModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (IBlogService blogService = DIService.GetService<IBlogService>())
                    {
                        var blogvm = blogService.GetBlog(reqModel);
                        return Json(blogvm);  //new ObjectResult(JsonService.SerializeObject(blogvm));
                    }
                }
                return new ObjectResult("{ message:" + "对象不合法" + " }");
            }
            catch (System.Exception ex)
            {
                this._logger.LogError(ex.InnerException.Message);
                var jsonstr = "{ message:" + ex.InnerException.Message + " }";
                return new ObjectResult(jsonstr);
            }
        }

        [HttpGet()]
        public IActionResult GetAll()
        {
            // return Json("GetAll function failed!");
            throw new Exception("GetAll function failed!!");
        }

        [HttpPost]
        public IActionResult Post([FromBody] RequestMessage<BlogViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IBlogService blogService = DIService.GetService<IBlogService>())
                {
                    var blogVM = reqMsg.Playload.FirstOrDefault();
                    var result = blogService.CreateOrUpdateBlog2(reqMsg);
                    return Json(result);
                }
            }
            return BadRequest();

            //CreatedAtAction("Get", new { id = 123 }, new User() { Id = new Random().Next(1, 10), Name = "myad", Sex = "男" });
            // user.Id = new Random().Next(1, 10);
            // return CreatedAtAction("Get", new { id = user.Id }, user);
        }

        [HttpPost]
        public IActionResult CreateReport([FromBody] RequestMessage<ReportViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IReportService rptSrv = DIService.GetService<IReportService>())
                {
                    var rpt = reqMsg.Playload.FirstOrDefault();
                    var result = rptSrv.CreateOrUpdateReport(reqMsg);
                    return Json(result, JsonService.SelfLoopJsonSettings);
                }
            }
            return BadRequest();
        }

        [HttpPost()]
        public IActionResult GetReport([FromBody]RequestMessage<ReportViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IReportService rptSrv = DIService.GetService<IReportService>())
                {
                    // var rpt = reqMsg.Playload.FirstOrDefault();
                    var result = rptSrv.GetReport(reqMsg);
                    return Json(result, JsonService.SelfLoopJsonSettings);
                }
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            return new NoContentResult();
        }
        [HttpDelete("{id}")]
        public void Delete(int id)
        {

        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            _logger.LogInformation("Controller executing!");
        }
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            _logger.LogInformation("Controller Executed!");
        }

    }
}