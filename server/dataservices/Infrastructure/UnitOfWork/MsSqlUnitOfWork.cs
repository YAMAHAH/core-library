
namespace DataService.Infrastructure.UnitOfWork
{
    public class MsSqlUnitOfWork : UnitOfWork
    {
        protected override DbContextBase GetDbContext()
        {
            return new MsSqlContext(DataService.AppConfig.MasterDatabaseInfo);
        }
    }
}
