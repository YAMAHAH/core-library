
using System;
using ApiService.Utils;
using DataService.Models;
using dataservices.Models.users;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ApiService.Controllers
{
    // [Authorize]
    [EnableCors("defaultCors")]
    [Route("api/[controller]/[action]")]
    public class UserManagerController : Controller
    {
        private ILogger<UsersController> _logger;
        public UserManagerController(ILogger<UsersController> logger)
        {
            this._logger = logger;
        }

        [HttpPost()]
        public IActionResult Login([FromBody]RequestMessage<UserViewModel> reqMsg)
        {
            return RedirectToRoute("/api/token", "");
        }

        [HttpPost()]
        public IActionResult Signup()
        {
            var username = HttpContext.Request.Form["username"];
            var password = HttpContext.Request.Form["password"];
            var sign = HmacHelper.HmacSha1ToBase64(username, password);
            Console.WriteLine(HttpContext.Request.Host.Value);
            //return RedirectToRoute("HttpContext.Request.Host.Value" + "/api/token", new { username, sign });
            return new JsonResult(new { username, usersign = sign });  //RedirectToRoute("/api/token", "username=" + username + "&usersign=" + sign);
        }

    }
}