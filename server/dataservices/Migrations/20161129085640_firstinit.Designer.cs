using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using DataService.Infrastructure.UnitOfWork;

namespace dataservices.Migrations
{
    [DbContext(typeof(MySqlContext))]
    [Migration("20161129085640_firstinit")]
    partial class firstinit
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

            modelBuilder.Entity("DataServices.Models.BomStructure", b =>
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

            modelBuilder.Entity("DataServices.Models.Product", b =>
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

            modelBuilder.Entity("DataServices.Models.ProductVersion", b =>
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

            modelBuilder.Entity("DataServices.Models.Report", b =>
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

            modelBuilder.Entity("DataService.Models.Post", b =>
                {
                    b.HasOne("DataService.Models.Blog", "Blog")
                        .WithMany("Posts")
                        .HasForeignKey("BlogId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DataServices.Models.BomStructure", b =>
                {
                    b.HasOne("DataServices.Models.ProductVersion", "NodeVersion")
                        .WithMany("NodeRefs")
                        .HasForeignKey("NodeVersionId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("DataServices.Models.BomStructure", "Parent")
                        .WithMany("Childs")
                        .HasForeignKey("ParentId");

                    b.HasOne("DataServices.Models.ProductVersion", "RootVersion")
                        .WithMany("RootRefs")
                        .HasForeignKey("RootVersionId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DataServices.Models.ProductVersion", b =>
                {
                    b.HasOne("DataServices.Models.Product", "Product")
                        .WithMany("ProductVersions")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DataServices.Models.Report", b =>
                {
                    b.HasOne("DataServices.Models.Report", "Parent")
                        .WithMany("Childs")
                        .HasForeignKey("ParentId");
                });
        }
    }
}
