using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace ApiService.Filters
{
    public class MyActionTypeFilter2 : TypeFilterAttribute
    {
        public MyActionTypeFilter2() : base(typeof(MyActionFilterImpl))
        {

        }

        private class MyActionFilterImpl : IActionFilter
        {
            private readonly ILogger<MyActionFilterImpl> logger;
            public MyActionFilterImpl(ILoggerFactory loggerFactory)
            {
                logger = loggerFactory.CreateLogger<MyActionFilterImpl>();
            }

            public void OnActionExecuted(ActionExecutedContext context)
            {

            }

            public void OnActionExecuting(ActionExecutingContext context)
            {
                context.HttpContext.Response.Headers.Add("actionFilterHeader", "MyActionFilterImpl");
                logger.LogInformation("MyActionFilterImpl Executing");
            }
        }
    }
}