using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace ApiService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel(option => { })
                .UseUrls("http://*:5000")
                .UseIISIntegration()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>()
                .Build();
            host.Run();
        }
    }
}
