using System.Data.Common;
using DataService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace DataService.Infrastructure.UnitOfWork
{
    public abstract class DbContextBase : DbContext
    {
        public DbContextBase() : base()
        {

        }

        public IDbContextTransaction CommittableTransaction { get; set; }

        public string StoreName { get; set; }
        public DatabaseConfig databaseInfo;
        public DbContextBase(DbContextOptions<DbContextBase> options) : base(options)
        {

        }
        public DbTransaction GetDbTransaction()
        {
            return this.CommittableTransaction.GetDbTransaction();
        }
        public void UseTransaction(DbContextBase dbcontext)
        {
            this.Database.UseTransaction(dbcontext.GetDbTransaction());
            this.CommittableTransaction = dbcontext.CommittableTransaction;
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Blog>()
                .Property(b => b.Url)
                .IsRequired();
            modelBuilder.Entity<Blog>()
            .HasIndex(e => e.BlogName);



            // modelBuilder.Entity<Report>()
            // .Property(r => r.UpdateDate)
            // .HasDefaultValueSql("NOW()");

            // modelBuilder.Entity<Report>()
            // .Property<DateTime>("LastUpdated");

            modelBuilder.Entity<Report>()
            .ToTable("Reports")
            .HasOne(r => r.Parent)
            .WithMany(r => r.Childs)
            .HasForeignKey(r => r.ParentId);
            // .IsRequired(false);

            //     modelBuilder.Entity<Report>()
            //    .Property(r => r.CreateDate)
            //    .HasDefaultValueSql("now()")
            //    .ValueGeneratedOnAdd();

            //     modelBuilder.Entity<Report>()
            //    .Property(r => r.UpdateDate)
            //    .ValueGeneratedOnAddOrUpdate();
            //  .HasMany(r => r.Childs)
            //  .WithOne()

            //  .HasForeignKey(r => r.ParentReportId)
            //  .IsRequired(false);
            // .WithOne()
            // .HasForeignKey(r => r.ParentReportId)
            // .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<Report>()
            // .HasOne(r => r.Parent)
            // .WithMany()
            // .HasForeignKey(r => r.ParentReportId);

            modelBuilder.Entity<Product>(
                (pdt) =>
                {
                    pdt.ToTable("Products");
                    pdt.Property(p => p.ProductNo).IsRequired();
                    pdt.Property(p => p.ProductName).IsRequired();
                    pdt.Property(p => p.ProductDesc).IsRequired();
                    pdt.Property(p => p.Dw).IsRequired();
                    pdt.Property(p => p.CreateDate)
                    .ValueGeneratedOnAdd();
                    pdt.Property(p => p.UpdateDate)
                    .ValueGeneratedOnAddOrUpdate();
                }
            );

            modelBuilder.Entity<ProductVersion>((pver) =>
            {
                pver.ToTable("ProductVersions");
                pver.HasOne(pv => pv.Product)
                .WithMany(p => p.ProductVersions)
                .HasForeignKey(p => p.ProductId);
            });

            modelBuilder.Entity<BomStructure>((bs) =>
            {
                bs.ToTable("BomStructures")
             .HasOne(b => b.Parent)
             .WithMany(b => b.Childs)
             .HasForeignKey(r => r.ParentId);

                bs.HasOne(b => b.NodeVersion)
                   .WithMany(p => p.NodeRefs)
                   .HasForeignKey(b => b.NodeVersionId);
                bs.HasOne(b => b.RootVersion)
                .WithMany(p => p.RootRefs)
                .HasForeignKey(b => b.RootVersionId);
            });

            modelBuilder.Entity<OrderHeader>((orderHeader) =>
            {
                orderHeader.ToTable("OrderHeaders");
                orderHeader.Property(p => p.CreateDate)
                  .ValueGeneratedOnAdd();
                orderHeader.Property(p => p.UpdateDate)
                .ValueGeneratedOnAddOrUpdate();
            });

            modelBuilder.Entity<OrderDetail>((orderMx) =>
           {
               orderMx.ToTable("OrderDetails");
               orderMx.HasOne(mx => mx.OrderHeader)
               .WithMany(ordheader => ordheader.OrderDetailRows)
               .HasForeignKey(order => order.OrderHeaderId);
           });
        }
    }
}
