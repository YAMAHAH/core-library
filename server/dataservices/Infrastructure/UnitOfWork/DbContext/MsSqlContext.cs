
using Microsoft.EntityFrameworkCore;

namespace DataService.Infrastructure.UnitOfWork
{
    public class MsSqlContext : DbContextBase
    {
        private MsSqlContext()
        {

        }
        public MsSqlContext(DatabaseConfig dbInfo)
            : this()
        {
            databaseInfo = dbInfo;
            base.StoreName = dbInfo.Name;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Visual Studio 2015 | Use the LocalDb 12 instance created by Visual Studio
            // optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=EFGetStarted.ConsoleApp.NewDb;Trusted_Connection=True;");

            // Visual Studio 2013 | Use the LocalDb 11 instance created by Visual Studio
            // optionsBuilder.UseSqlServer(databaseInfo.ConnectionString);
        }
    }
}
