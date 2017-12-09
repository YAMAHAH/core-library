using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.StaticFiles;
using ApiService.Filters;
using DataService;
using System;
using Microsoft.Extensions.FileProviders;
using System.IO;
using ApiService.Middleware;

namespace ApiService
{
    public partial class Startup
    {

        //large Response test
        // private const int _chunkSize = 4096;
        // private const int _defaultNumChunks = 16;
        // private static byte[] _chunk = Encoding.UTF8.GetBytes(new string('a', _chunkSize));
        // private static Task _emptyTask = Task.FromResult<object>(null);

        public Startup(IHostingEnvironment env, ILoggerFactory logger)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            DIService.GetDbConfig();
        }
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            IServiceCollection newServices = new ServiceCollection();
            IServiceProvider serviceProvider = null;
            foreach (var service in services)
            {
                newServices.Add(service);
            }
            newServices.AddMvc(option =>
            {
                //全局引用Filter
                option.Filters.Add(typeof(TestResourceFilter));
                option.Filters.Add(typeof(TestActionFilter));
                option.Filters.Add(typeof(TestExceptionFilter));
                option.Filters.Add(typeof(TestResultFilter));
            });
            ////"http://192.168.10.125:3000", "http://localhost:3000","http://localhost:8080"
            newServices.AddScoped<MyActionServiceFilter>();
            newServices.AddCors(options => options.AddPolicy("defaultCors",
            p => p.WithOrigins("*")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            ));
          //  newServices.AddAuthorization();
            DIService.AddDataService(newServices);
            serviceProvider = newServices.BuildServiceProvider();
            DIService.SetServiceProvider(serviceProvider);
            return serviceProvider;
        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            // loggerFactory.AddConsole(LogLevel.Information);
            // loggerFactory.AddDebug();
            app.UseCors("defaultCors");
            ConfigureAuth(app);

            RequestDelegate handler = async context => await context.Response.WriteAsync("uhhandled exceptons coccurred!");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //   app.UseDatabaseErrorPage();
                //  app.UseBrowserLink();
            }
            else
            {
                app.UseMiddleware(typeof(ExceptionHandlerMiddleWare));
                // app.UseExceptionHandler(new ExceptionHandlerOptions { ExceptionHandler = handler });
            }


            //Run,自定义中间件，管道内最后一个，直接返回结果
            //app.Run(context => context.Response.WriteAsync("api service"));
            app.Use(async (context, next) =>
            {
                // context.Response.Headers.Add("Set-Cookie", "access_token:abcdef");
                await next();
            });

            // app.Use(next =>
            // {
            //     return async context =>
            //     {
            //         var start = DateTime.Now;
            //         await next.Invoke(context);
            //         var ts = DateTime.Now - start;
            //         await context.Response.WriteAsync($"<h1>请求耗时{ts.Milliseconds}毫秒</h1>");
            //         // await next(context);
            //     };
            // });


            //large Response
            // app.Run(async (context) =>
            // {
            //     int numChunks;
            //     var path = context.Request.Path;
            //     if (!path.HasValue || !int.TryParse(path.Value.Substring(1), out numChunks))
            //     {
            //         numChunks = _defaultNumChunks;
            //     }
            //     context.Response.ContentLength = _chunkSize * numChunks;
            //     context.Response.ContentType = "text/plain";
            //     for (int i = 0; i < numChunks; i++)
            //     {
            //         await context.Response.Body.WriteAsync(_chunk, 0, _chunkSize).ConfigureAwait(false);
            //     }
            // });

            app.Map("/test/child/3", MapTest);
            app.MapWhen(context =>
            {
                return context.Request.Path.Value == "/";
                // return context.Request.Path.StartsWithSegments("/admin");
                //return context.Request.Query.ContainsKey("client");
            }, MapTest);
            // app.UseVisitLogger();
            // app.UseTest();
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".txt"] = "text/html";
            provider.Mappings[".properties"] = "text/html";
            // app.UseStaticFiles();
            var staticFileOptions = new StaticFileOptions()
            {
                ContentTypeProvider = provider,
                FileProvider = new PhysicalFileProvider(@"D:\WebApp\client\SimpleEasy.Erp\dist"),
                // RequestPath = new PathString("/admin")
            };
            app.UseDefaultFiles();
            app.UseStaticFiles(staticFileOptions);
            var releaseFiles = new StaticFileOptions()
            {
                ContentTypeProvider = provider,
                FileProvider = new PhysicalFileProvider(@"D:\WebApp\client\SimpleEasy.Erp\bin\release"),
                // RequestPath = new PathString("/admin")
            };
            app.UseStaticFiles(releaseFiles);
            app.Use(async (context, next) =>
         {
             await next();

             if (context.Response.StatusCode == 404 &&
                 !Path.HasExtension(context.Request.Path.Value) &&
                 !context.Request.Path.Value.StartsWith("/node_modules/") &&
                 !context.Request.Path.Value.StartsWith("/api/") || context.Request.Path.Value == "/")
             {
                 if (File.Exists(@"D:\WebApp\client\SimpleEasy.Erp\bin\release\index.html"))
                     await context.Response.SendFileAsync(@"D:\WebApp\client\SimpleEasy.Erp\bin\release\index.html");
                 else
                     await context.Response.SendFileAsync(@"D:\WebApp\client\SimpleEasy.Erp\dist\index.html");
             }
         });
            // string libPath = Path.GetFullPath(Path.Combine(env.WebRootPath, @"..\node_modules\"));
            // app.UseStaticFiles(new StaticFileOptions
            // {
            //     FileProvider = new PhysicalFileProvider(libPath),
            //     RequestPath = new PathString("/node_modules")
            // });
            app.UseStaticFiles(new StaticFileOptions
            {
#if DEBUG
                OnPrepareResponse = (context) =>
                {
                    // Disable caching of all static files.
                    context.Context.Response.Headers["Cache-Control"] = "no-cache, no-store";
                    context.Context.Response.Headers["Pragma"] = "no-cache";
                    context.Context.Response.Headers["Expires"] = "-1";
                }
#endif
            });
            // app.UseCors(builder => builder.WithOrigins("http://*").AllowAnyHeader());

            app.UseMvcWithDefaultRoute();

            // app.UseMvc(routes =>
            // {
            //     routes.MapRoute(
            //         name: "default",
            //         template: "{controller=Home}/{action=Index}/{id?}");
            // });
            //     app.Use(async (context, next) =>
            //    {
            //        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            //        await next();

            //        // await context.Response.WriteAsync("ApiServer-Use");
            //    });
            //     app.Run(context => context.Response.WriteAsync("api service"));


        }

        private static void MapTest(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                if (File.Exists(@"D:\WebApp\client\SimpleEasy.Erp\bin\release\index.html"))
                    await context.Response.SendFileAsync(@"D:\WebApp\client\SimpleEasy.Erp\bin\release\index.html");
                else
                    await context.Response.SendFileAsync(@"D:\WebApp\client\SimpleEasy.Erp\dist\index.html");
                // await context.Response.WriteAsync("Url is " + context.Request.PathBase.ToString() + "Map");
            });
        }
    }
}