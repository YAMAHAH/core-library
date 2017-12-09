using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace ApiService.Filters
{
    public class TestResourceFilter : Attribute, IResourceFilter
    {
        private readonly ILogger<TestResourceFilter> logger;
        public TestResourceFilter(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<TestResourceFilter>();
        }
        public void OnResourceExecuted(ResourceExecutedContext context)
        {
            logger.LogInformation("ResourceFilter Executed!");
        }

        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            logger.LogInformation("ResourceFilter Executing!");
        }
    }
}