using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace ApiService.Filters
{
    public class TestExceptionFilter : ExceptionFilterAttribute, IExceptionFilter
    {
        private readonly ILogger<TestExceptionFilter> logger;
        public TestExceptionFilter(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<TestExceptionFilter>();
        }

        public override void OnException(ExceptionContext context)
        {
            logger.LogInformation("ExceptionFilter Execute! Message:" + context.Exception.Message);
            var jsonstr = $"{{ErrorMessage:{context.Exception.Message}}}";
            // Console.WriteLine(jsonstr);
            // context.Result = new ObjectResult(jsonstr);
            // context.HttpContext.Response.WriteAsync(jsonstr);
            // context.ExceptionHandled = true;
            //  base.OnException(context);
        }
    }
}