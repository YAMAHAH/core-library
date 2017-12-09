using Microsoft.EntityFrameworkCore;

namespace DataService.Infrastructure.UnitOfWork
{
    public class SqliteContext : DbContextBase
    {
        private SqliteContext()
        {

        }
        public SqliteContext(DatabaseConfig dbInfo)
        {
            databaseInfo = dbInfo;
            base.StoreName = dbInfo.Name;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource="blog.db" };
            //  var connectionString = connectionStringBuilder.ToString();
            // var connection = new SqliteConnection(databaseInfo.ConnectionString);
            // optionsBuilder.UseSqlite(databaseInfo.ConnectionString);          
        }
    }
}
