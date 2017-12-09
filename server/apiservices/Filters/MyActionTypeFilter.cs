using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ApiService.Filters
{
    public class MyActionTypeFilter : Attribute, IActionFilter
    {
        private readonly string _key;
        private readonly string _value;
        public MyActionTypeFilter(string key, string value)
        {
            this._key = key;
            this._value = value;
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {

        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            context.HttpContext.Response.Headers.Add(_key, _value);
        }
    }
}