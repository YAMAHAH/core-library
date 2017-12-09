
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;

namespace DataService.Infrastructure.UnitOfWork
{
    public class MySqlUnitOfWork : UnitOfWork
    {
        public MySqlUnitOfWork()
        {

        }
        public MySqlUnitOfWork(IUnitOfWork unitOfWork)
        {
            this.UnitOfWorkRef = unitOfWork;
        }
        protected override DbContextBase GetDbContext()
        { //DataService.AppConfig.MasterDatabaseInfo.ConnectionString
            //DIService.RegisterService();
            if (this.UnitOfWorkRef == null)
            {
                this.options = new DbContextOptionsBuilder<DbContextBase>()
          .UseMySql(new MySqlConnection(DataService.AppConfig.MasterDatabaseInfo.ConnectionString))
          .Options;
                xDbContextBase = new MySqlContext(options);
                xDbContextBase.CommittableTransaction = xDbContextBase.Database.BeginTransaction();
            }
            else
            {
                xDbContextBase = new MySqlContext(this.UnitOfWorkRef.options);
                this.UseTransaction(UnitOfWorkRef);
            }
            return null;
        }
    }
}
