using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace ApiService.Filters
{
    public class TestResultFilter : Attribute, IResultFilter
    {
        private readonly ILogger<TestResultFilter> logger;
        public TestResultFilter(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<TestResultFilter>();
        }

        public void OnResultExecuted(ResultExecutedContext context)
        {
            logger.LogInformation("ResultFilter Executed!");
        }

        public void OnResultExecuting(ResultExecutingContext context)
        {
            logger.LogInformation("ResultFilter Executing!");
        }
    }
}
