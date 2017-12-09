using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace ApiService.Filters
{
    public class MyActionServiceFilter : Attribute, IActionFilter
    {
        private readonly ILogger<MyActionServiceFilter> logger;
        public MyActionServiceFilter(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<MyActionServiceFilter>();
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {

        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            context.HttpContext.Response.Headers.Add("my-actionFilter", "ApiService Filter");
            logger.LogInformation("MyActionFilter executing!");
        }
    }
}