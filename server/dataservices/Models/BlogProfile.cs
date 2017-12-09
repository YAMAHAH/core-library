using AutoMapper;
using DataService.Models;

namespace DataService.Services
{
    public class BlogProfile : Profile
    {
        public BlogProfile()
        {
            CreateMap<Blog, BlogViewModel>();
            CreateMap<BlogViewModel, Blog>();
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<BlogProfile>();
            });
            var maper = config.CreateMapper();
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Blog, BlogViewModel>();
                cfg.AddProfile<BlogProfile>();
            });
        }
        // protected override void Configure()
        // {
        //     CreateMap<Blog, BlogViewModel>();
        //     CreateMap<BlogViewModel, Blog>();
        //     // Use CreateMap... Etc.. here (Profile methods are the same as configuration methods)
        // }
    }
}