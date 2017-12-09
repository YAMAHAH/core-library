using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace ApiService.Filters
{
    public class TestActionFilter : Attribute, IActionFilter
    {
        private readonly ILogger<TestActionFilter> logger;
        public TestActionFilter(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<TestActionFilter>();
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            logger.LogInformation("ActionFilter Executed");
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            this.logger.LogInformation("ActionFilter Executing");
        }
    }
}