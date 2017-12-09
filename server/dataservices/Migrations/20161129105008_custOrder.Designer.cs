using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using DataService.Infrastructure.UnitOfWork;

namespace dataservices.Migrations
{
    [DbContext(typeof(MySqlContext))]
    [Migration("20161129105008_custOrder")]
    partial class custOrder
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-preview1-22509");

            modelBuilder.Entity("DataService.Models.Blog", b =>
                {
                    b.Property<int>("BlogId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("BlogName");

                    b.Property<string>("Url")
                        .IsRequired();

                    b.HasKey("BlogId");

                    b.HasIndex("BlogName");

                    b.ToTable("Blog");
                });

            modelBuilder.Entity("DataService.Models.BomStructure", b =>
                {
                    b.Property<int>("BomStructureId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsVirtualPart");

                    b.Property<int>("Level");

                    b.Property<int>("Lft");

                    b.Property<int>("NodeVersionId");

                    b.Property<int>("Ord");

                    b.Property<int?>("ParentId");

                    b.Property<int>("Rgt");

                    b.Property<int>("RootVersionId");

                    b.Property<double>("SingleTotal");

                    b.Property<double>("Total");

                    b.HasKey("BomStructureId");

                    b.HasIndex("NodeVersionId");

                    b.HasIndex("ParentId");

                    b.HasIndex("RootVersionId");

                    b.ToTable("BomStructures");
                });

            modelBuilder.Entity("DataService.Models.OrderDetail", b =>
                {
                    b.Property<int>("OrderDetailId")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("CostPrice");

                    b.Property<string>("CustomerOrderNo");

                    b.Property<double>("DisCount");

                    b.Property<int>("Ord");

                    b.Property<DateTime?>("OrderDetailDelivery");

                    b.Property<double>("OrderFinishTotal");

                    b.Property<int>("OrderHeaderId");

                    b.Property<double>("OrderLeftTotal");

                    b.Property<double>("OrderTotal");

                    b.Property<double>("Price");

                    b.Property<int>("ProductVersionId");

                    b.Property<string>("Rem");

                    b.Property<bool>("SF_MxFin");

                    b.HasKey("OrderDetailId");

                    b.HasIndex("OrderHeaderId");

                    b.HasIndex("ProductVersionId");

                    b.ToTable("OrderDetails");
                });

            modelBuilder.Entity("DataService.Models.OrderHeader", b =>
                {
                    b.Property<int>("OrderHeaderId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDate")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CustomerOrderNo");

                    b.Property<DateTime?>("OrderDelivery");

                    b.Property<string>("OrderHeaderNo");

                    b.Property<int>("PartnerId");

                    b.Property<bool>("SF_Cancel");

                    b.Property<bool>("SF_Finish");

                    b.Property<DateTime>("UpdateDate")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("OrderHeaderId");

                    b.ToTable("OrderHeaders");
                });

            modelBuilder.Entity("DataService.Models.Post", b =>
                {
                    b.Property<int>("PostId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BlogId");

                    b.Property<string>("Content");

                    b.Property<string>("Title");

                    b.HasKey("PostId");

                    b.HasIndex("BlogId");

                    b.ToTable("Post");
                });

            modelBuilder.Entity("DataService.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDate")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Dw")
                        .IsRequired();

                    b.Property<string>("ProductDesc")
                        .IsRequired();

                    b.Property<string>("ProductName")
                        .IsRequired();

                    b.Property<string>("ProductNo")
                        .IsRequired();

                    b.Property<DateTime>("UpdateDate")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("ProductId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("DataService.Models.ProductVersion", b =>
                {
                    b.Property<int>("ProductVersionId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ProductId");

                    b.Property<string>("Version");

                    b.Property<DateTime>("VersionDate");

                    b.HasKey("ProductVersionId");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductVersions");
                });

            modelBuilder.Entity("DataService.Models.Report", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<bool>("IsLocal");

                    b.Property<bool>("IsReport");

                    b.Property<bool>("IsVirtualPart");

                    b.Property<int>("Level");

                    b.Property<int>("Lft");

                    b.Property<int>("Ord");

                    b.Property<int?>("ParentId");

                    b.Property<string>("Remark");

                    b.Property<byte[]>("ReportData");

                    b.Property<string>("ReportName");

                    b.Property<int>("Rgt");

                    b.Property<int>("RootId");

                    b.Property<DateTime>("UpdateDate");

                    b.HasKey("ReportId");

                    b.HasIndex("ParentId");

                    b.ToTable("Reports");
                });

            modelBuilder.Entity("DataService.Models.BomStructure", b =>
                {
                    b.HasOne("DataService.Models.ProductVersion", "NodeVersion")
                        .WithMany("NodeRefs")
                        .HasForeignKey("NodeVersionId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("DataService.Models.BomStructure", "Parent")
                        .WithMany("Childs")
                        .HasForeignKey("ParentId");

                    b.HasOne("DataService.Models.ProductVersion", "RootVersion")
                        .WithMany("RootRefs")
                        .HasForeignKey("RootVersionId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DataService.Models.OrderDetail", b =>
                {
                    b.HasOne("DataService.Models.OrderHeader", "OrderHeader")
                        .WithMany("OrderDetailRows")
                        .HasForeignKey("OrderHeaderId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("DataService.Models.ProductVersion", "ProductVersion")
                        .WithMany()
                        .HasForeignKey("ProductVersionId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DataService.Models.Post", b =>
                {
                    b.HasOne("DataService.Models.Blog", "Blog")
                        .WithMany("Posts")
                        .HasForeignKey("BlogId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DataService.Models.ProductVersion", b =>
                {
                    b.HasOne("DataService.Models.Product", "Product")
                        .WithMany("ProductVersions")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DataService.Models.Report", b =>
                {
                    b.HasOne("DataService.Models.Report", "Parent")
                        .WithMany("Childs")
                        .HasForeignKey("ParentId");
                });
        }
    }
}
