using System.Linq;
using DataService;
using DataService.Infrastructure;
using DataService.Models;
using dataservices.Services.ProductService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace apiservices.Controllers
{
    [Authorize]
    [EnableCors("defaultCors")]
    [Route("api/[controller]/[action]")]
    public class BomManagerController : Controller
    {
        private ILogger<BomManagerController> _logger;
        public BomManagerController(ILogger<BomManagerController> logger)
        {
            this._logger = logger;
        }
        [HttpPost]
        public IActionResult UpsertBomNode([FromBody] RequestMessage<BomNodeViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IBomManagerService bomSrv = DIService.GetService<IBomManagerService>())
                {
                    var rpt = reqMsg.Playload.FirstOrDefault();
                    var result = bomSrv.UpsertBomNode(reqMsg);
                    return Json(result, JsonService.SelfLoopJsonSettings);
                }
            }
            return BadRequest();
        }

        [HttpPost]
        public IActionResult UpsertRootBomNode([FromBody] RequestMessage<BomNodeViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IBomManagerService bomSrv = DIService.GetService<IBomManagerService>())
                {
                    var rpt = reqMsg.Playload.FirstOrDefault();
                    var result = bomSrv.UpsertRootBomNode(reqMsg);
                    return Json(result, JsonService.SelfLoopJsonSettings);
                }
            }
            return BadRequest();
        }

        [HttpDelete()]
        public IActionResult DeleteBomNode([FromBody]RequestMessage<BomNodeViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IBomManagerService bomSrv = DIService.GetService<IBomManagerService>())
                {
                    var result = bomSrv.DeleteBomNode(reqMsg);
                    return Json(result, JsonService.SelfLoopJsonSettings);
                }
            }
            return BadRequest();
        }
    }
}