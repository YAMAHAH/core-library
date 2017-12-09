

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using DataService.Infrastructure;
using DataService.Services;
using dataservices.Services.ProductService;
using dataservices.Services.ReportService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace DataService
{
    public static class DIService
    {
        public static IServiceCollection ServicesContainer = new ServiceCollection();
        public static IServiceProvider ServiceProvider;

        public static T GetService<T>()
        {

            return ServiceProvider.GetService<T>();
        }

        public static IEnumerable<T> GetServices<T>()
        {
            return ServiceProvider.GetServices<T>();
        }

        public static void AddDataService(IServiceCollection services)
        {
            if (services != null)
            {
                ServicesContainer = services;
            }
            ServicesContainer.AddTransient<IBlogService, BlogService>();
            ServicesContainer.AddTransient<IReportService, ReportService>();
            ServicesContainer.AddTransient<IBomManagerService, BomManagerService>();
        }

        public static void SetServiceProvider(IServiceProvider serviceProvider)
        {
            ServiceProvider = serviceProvider;
        }

        public static void GetDbConfig()
        {
            IServiceCollection services = new ServiceCollection();
            var configBuilder = new ConfigurationBuilder();
            configBuilder.AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();
            services.AddOptions();

            services.Configure<DatabaseConfig>(Configuration.GetSection("DbConfig"));
            var serviceProvider = services.BuildServiceProvider();
            var dbconfig = serviceProvider.GetService<IOptions<DatabaseConfig>>();
            AppConfig.MasterDatabaseInfo = dbconfig.Value;
        }


        public static void RegisterService()
        {
            var configBuilder = new ConfigurationBuilder();
            configBuilder.AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();
            ServicesContainer.AddOptions();

            ServicesContainer.AddTransient<IBlogService, BlogService>();
            ServicesContainer.AddTransient<IReportService, ReportService>();
            ServicesContainer.AddTransient<IBomManagerService, BomManagerService>();

            ServicesContainer.Configure<DatabaseConfig>(Configuration.GetSection("DbConfig"));
            ServiceProvider = ServicesContainer.BuildServiceProvider();
            ReadJsonToDict();
            // var dbconfig = serviceProvider.GetService<IOptions<DatabaseConfig>>();

            //注入
            //  services.AddTransient<IMemcachedClient, MemcachedClient>();
            //构建容器

            //解析
            // var memcachedClient = serviceProvider.GetService<IMemcachedClient>();
        }

        private static void ReadJsonToDict()
        {
            Dictionary<string, string> source = new Dictionary<string, string>
            {
                ["foo:gender"] = "Male",
                ["foo:age"] = "18",
                ["foo:contactInfo:emailAddress"] = "foo@outlook.com",
                ["foo:contactInfo:phoneNo"] = "123",

                ["bar:gender"] = "Male",
                ["bar:age"] = "25",
                ["bar:contactInfo:emailAddress"] = "bar@outlook.com",
                ["bar:contactInfo:phoneNo"] = "456",

                ["baz:gender"] = "Female",
                ["baz:age"] = "36",
                ["baz:contactInfo:emailAddress"] = "baz@outlook.com",
                ["baz:contactInfo:phoneNo"] = "789"
            };

            IConfiguration config = new ConfigurationBuilder()
                .Add(new MemoryConfigurationSource { InitialData = source })
               .Build();
            //绑定字典
            Dictionary<string, Profile1> profiles = new ServiceCollection()
               .AddOptions()
               .Configure<Dictionary<string, Profile1>>(config)
               .BuildServiceProvider()
               .GetService<IOptions<Dictionary<string, Profile1>>>()
              .Value;

            //绑定集合
            Collection<Profile1> profiles1 = new ServiceCollection()
                .AddOptions()
                .Configure<Collection<Profile1>>(config)
                .BuildServiceProvider()
                .GetService<IOptions<Collection<Profile1>>>()
                .Value;
            Dictionary<string, string> source1 = new Dictionary<string, string>
            {
                ["gender"] = "Male",
                ["age"] = "18",
                ["contactInfo:emailAddress"] = "foobar@outlook.com",
                ["contactInfo:phoneNo"] = "123456789"
            };

            //绑定复杂类型对象
            IConfiguration config1 = new ConfigurationBuilder()
               .Add(new MemoryConfigurationSource { InitialData = source1 })
               .Build();

            Profile1 profile = new ServiceCollection()
                  .AddOptions()
                  .Configure<Profile1>(config1)
                  .BuildServiceProvider()
                  .GetService<IOptions<Profile1>>()
                  .Value;
        }

    }
    public class Profile1
    {
        public Gender Gender { get; set; }
        public int Age { get; set; }
        public ContactInfo ContactInfo { get; set; }
    }

    public class ContactInfo
    {
        public string EmailAddress { get; set; }
        public string PhoneNo { get; set; }
    }

    public enum Gender
    {
        Male,
        Female
    }
}