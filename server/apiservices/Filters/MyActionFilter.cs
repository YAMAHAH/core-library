using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace ApiService.Filters
{
    public class MyActionFilter : Attribute, IActionFilter, IOrderedFilter
    {
        private readonly int _order;
        private readonly string _target;
        private ILogger<MyActionFilter> logger = null;
        public int Order
        {
            get
            {
                return _order;
            }
        }
        public MyActionFilter(string target, int order = 0)
        {
            _order = order;
            _target = target;
            ILoggerFactory loggerFactory = new LoggerFactory();
            loggerFactory.WithFilter(new FilterLoggerSettings(){
              {"Microsoft",LogLevel.Warning}
          });
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            logger.LogInformation($"{_target} Executed!");
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            logger.LogInformation($"{_target} Executing");
            context.HttpContext.Response.Headers.Add("my-action-filter", "ApiService-action-filter");
        }
    }
}