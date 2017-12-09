
namespace DataService.Infrastructure.UnitOfWork
{
    public class LiteSqlUnitOfWork : UnitOfWork
    {
        protected override DbContextBase GetDbContext()
        {
            return new SqliteContext(DataService.AppConfig.MasterDatabaseInfo);
        }
    }
}
