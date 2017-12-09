using System;

namespace DataService.ServicesBase
{
    public interface IServiceBase : IDisposable
    {
        int AcceptAllChanges();
        int SaveChanges();
        bool Commit();
        void Rollback();
    }
}
