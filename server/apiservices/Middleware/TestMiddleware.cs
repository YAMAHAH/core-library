using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;

namespace ApiService.Middleware
{
    public class TestMiddleware
    {
        private readonly RequestDelegate _next;
        public TestMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            httpContext.Response.Headers.Add("TestMiddleware", "TestMiddleware");
            await this._next.Invoke(httpContext);

        }
    }
    public static class TestMiddlewareExtensions
    {
        public static IApplicationBuilder UseTest(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TestMiddleware>();
        }
    }
}