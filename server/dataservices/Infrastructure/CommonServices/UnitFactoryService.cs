using DataService.Infrastructure;
using DataService.Infrastructure.UnitOfWork;

namespace DataService
{
    public static class UnitFactoryService
    {
        internal static IUnitOfWork GetUnitOfWork()
        {

            if (AppConfig.MasterDatabaseInfo.StoreType == StoreType.MsSql)
            {
                return new MsSqlUnitOfWork();
            }
            else if (AppConfig.MasterDatabaseInfo.StoreType == StoreType.LiteSql)
            {
                return new LiteSqlUnitOfWork();
            }
            else
            {
                return new MySqlUnitOfWork();
            }
        }
        internal static IUnitOfWork GetUnitOfWork(IUnitOfWork unitOfWork)
        {

            if (AppConfig.MasterDatabaseInfo.StoreType == StoreType.MsSql)
            {
                return new MsSqlUnitOfWork();
            }
            else if (AppConfig.MasterDatabaseInfo.StoreType == StoreType.LiteSql)
            {
                return new LiteSqlUnitOfWork();
            }
            else
            {
                return new MySqlUnitOfWork(unitOfWork);
            }
        }
        public static DbContextBase GetStore(DatabaseConfig dbInfo)
        {
            if (dbInfo == null)
            {
                return null;
            }
            if (dbInfo.StoreType == StoreType.MsSql)
            {
                return new MsSqlContext(dbInfo);
            }
            else if (dbInfo.StoreType == StoreType.LiteSql)
            {
                return new SqliteContext(dbInfo);
            }
            else
            {
                return new MySqlContext(dbInfo);
            }
        }
    }
}
