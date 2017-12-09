
namespace DataService.Infrastructure
{
    public class DatabaseConfig
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public StoreType StoreType { get; set; }
    }
   public class MasterDataBaseInfo : DatabaseConfig
   {

   }
}
