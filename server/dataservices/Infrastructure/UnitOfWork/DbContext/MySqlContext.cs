
using Microsoft.EntityFrameworkCore;

namespace DataService.Infrastructure.UnitOfWork
{
    public class MySqlContext : DbContextBase
    {
        public MySqlContext()
        {

        }
        public MySqlContext(DatabaseConfig dbInfo)
            : this()
        {
            databaseInfo = dbInfo;
            this.StoreName = dbInfo.Name;
        }
        public MySqlContext(DbContextOptions<DbContextBase> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // var options = new DbContextOptionsBuilder<MySqlContext>()
            // .UseMySql(new MySqlConnection(@"server=localhost;userid=root;pwd=99b3ad6e;port=3306;database=blogdb;sslmode=none;"))
            // .Options;
            //this.Database.UseTransaction();
            // optionsBuilder.UseMySql(@"server=localhost;userid=root;pwd=99b3ad6e;port=3306;database=blogdb;sslmode=none;");
        }
    }
}
