using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using DataService.Models;

namespace ApiService.Middleware
{
    public class ExceptionHandlerMiddleWare
    {
        private readonly RequestDelegate next;

        public ExceptionHandlerMiddleWare(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.GetBaseException().Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            if (exception == null) return;
            await WriteExceptionAsync(context, exception).ConfigureAwait(false);
        }

        private static async Task WriteExceptionAsync(HttpContext context, Exception exception)
        {
            //记录日志
            // LogHelper.Error(exception.GetBaseException().ToString());

            //返回友好的提示
            var response = context.Response;

            //状态码
            if (exception is UnauthorizedAccessException)
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
            else if (exception is Exception)
                response.StatusCode = (int)HttpStatusCode.BadRequest;

            response.ContentType = context.Request.Headers["Accept"];

            if (response.ContentType.ToLower() == "application/xml")
            {
                await response.WriteAsync(Object2XmlString(exception.GetBaseException().Message)).ConfigureAwait(false);
            }
            else
            {
                response.ContentType = "application/json";

                var oo = BadResponse<int>(exception.GetBaseException().Message);

                await response.WriteAsync(JsonConvert.SerializeObject(oo)
                   ).ConfigureAwait(false);
            }
        }

        private static ResponseMessage<T> BadResponse<T>(string msg)
        {
            var resMsg = new ResponseMessage<T>();
            resMsg.ReturnStatus = true;
            resMsg.StatusCode = (int)HttpStatusCode.BadRequest;
            resMsg.ReturnMessages.Add(msg);
            return resMsg;
        }
        /// <summary>
        /// 对象转为Xml
        /// </summary>
        /// <param name="o"></param>
        /// <returns></returns>
        private static string Object2XmlString(object o)
        {
            StringWriter sw = new StringWriter();
            try
            {
                //  XmlSerializer serializer = new XmlSerializer(o.GetType());
                //  serializer.Serialize(sw, o);
            }
            catch
            {
                //Handle Exception Code
            }
            finally
            {
                sw.Dispose();
            }
            return sw.ToString();
        }

    }
    public static class ExceptionHandlerMiddleWareExtensions
    {
        public static IApplicationBuilder UseTest(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlerMiddleWare>();
        }
    }
}