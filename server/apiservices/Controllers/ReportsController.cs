using System;
using System.Linq;
using DataService;
using DataService.Infrastructure;
using DataService.Models;
using dataservices.Services.ReportService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace apiservices.Controllers
{
    [Authorize]
    [EnableCors("defaultCors")]
    [Route("api/[controller]/[action]")]
    public class ReportsController : Controller
    {
        private ILogger<ReportsController> _logger;
        public ReportsController(ILogger<ReportsController> logger)
        {
            this._logger = logger;
        }
        [HttpPost]
        public IActionResult CreateOrUpdateReport([FromBody] RequestMessage<ReportViewModel> reqMsg)
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

        [HttpPost]
        public IActionResult CreateOrUpdateRootReport([FromBody] RequestMessage<ReportViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IReportService rptSrv = DIService.GetService<IReportService>())
                {
                    var rpt = reqMsg.Playload.FirstOrDefault();
                    var result = rptSrv.CreateOrUpdateRootReport(reqMsg);
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
                    var result = rptSrv.GetReport(reqMsg);
                    return Json(result, JsonService.SelfLoopJsonSettings);
                }
            }
            return BadRequest();
        }

        [HttpDelete()]
        public IActionResult DeleteReport([FromBody]RequestMessage<ReportViewModel> reqMsg)
        {
            if (ModelState.IsValid)
            {
                using (IReportService rptSrv = DIService.GetService<IReportService>())
                {
                    var result = rptSrv.DeleteReport(reqMsg);
                    return Json(result, JsonService.SelfLoopJsonSettings);
                }
            }
            return BadRequest();
        }
    }
}