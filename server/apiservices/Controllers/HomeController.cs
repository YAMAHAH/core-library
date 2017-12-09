using Microsoft.AspNetCore.Mvc;

namespace apiservices.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet()]
        public IActionResult Index()
        {
            // var data = "[{'id':11,'name':'Mr. Nice'},{'id':12,'name':'Narco'}]";
            return Redirect("/index.html");
        }
    }
}