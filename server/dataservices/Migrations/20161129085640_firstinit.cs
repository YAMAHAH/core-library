using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace dataservices.Migrations
{
    public partial class firstinit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Blog",
                columns: table => new
                {
                    BlogId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    BlogName = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blog", x => x.BlogId);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    CreateDate = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    Dw = table.Column<string>(nullable: false),
                    ProductDesc = table.Column<string>(nullable: false),
                    ProductName = table.Column<string>(nullable: false),
                    ProductNo = table.Column<string>(nullable: false),
                    UpdateDate = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAddOrUpdate", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    ReportId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    CreateDate = table.Column<DateTime>(nullable: false),
                    Creator = table.Column<string>(nullable: true),
                    IsLocal = table.Column<bool>(nullable: false),
                    IsReport = table.Column<bool>(nullable: false),
                    IsVirtualPart = table.Column<bool>(nullable: false),
                    Level = table.Column<int>(nullable: false),
                    Lft = table.Column<int>(nullable: false),
                    Ord = table.Column<int>(nullable: false),
                    ParentId = table.Column<int>(nullable: true),
                    Remark = table.Column<string>(nullable: true),
                    ReportData = table.Column<byte[]>(nullable: true),
                    ReportName = table.Column<string>(nullable: true),
                    Rgt = table.Column<int>(nullable: false),
                    RootId = table.Column<int>(nullable: false),
                    UpdateDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.ReportId);
                    table.ForeignKey(
                        name: "FK_Reports_Reports_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Reports",
                        principalColumn: "ReportId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Post",
                columns: table => new
                {
                    PostId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    BlogId = table.Column<int>(nullable: false),
                    Content = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Post", x => x.PostId);
                    table.ForeignKey(
                        name: "FK_Post_Blog_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blog",
                        principalColumn: "BlogId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductVersions",
                columns: table => new
                {
                    ProductVersionId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    ProductId = table.Column<int>(nullable: false),
                    Version = table.Column<string>(nullable: true),
                    VersionDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVersions", x => x.ProductVersionId);
                    table.ForeignKey(
                        name: "FK_ProductVersions_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BomStructures",
                columns: table => new
                {
                    BomStructureId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    IsVirtualPart = table.Column<bool>(nullable: false),
                    Level = table.Column<int>(nullable: false),
                    Lft = table.Column<int>(nullable: false),
                    NodeVersionId = table.Column<int>(nullable: false),
                    Ord = table.Column<int>(nullable: false),
                    ParentId = table.Column<int>(nullable: true),
                    Rgt = table.Column<int>(nullable: false),
                    RootVersionId = table.Column<int>(nullable: false),
                    SingleTotal = table.Column<double>(nullable: false),
                    Total = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BomStructures", x => x.BomStructureId);
                    table.ForeignKey(
                        name: "FK_BomStructures_ProductVersions_NodeVersionId",
                        column: x => x.NodeVersionId,
                        principalTable: "ProductVersions",
                        principalColumn: "ProductVersionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BomStructures_BomStructures_ParentId",
                        column: x => x.ParentId,
                        principalTable: "BomStructures",
                        principalColumn: "BomStructureId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BomStructures_ProductVersions_RootVersionId",
                        column: x => x.RootVersionId,
                        principalTable: "ProductVersions",
                        principalColumn: "ProductVersionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Blog_BlogName",
                table: "Blog",
                column: "BlogName");

            migrationBuilder.CreateIndex(
                name: "IX_Post_BlogId",
                table: "Post",
                column: "BlogId");

            migrationBuilder.CreateIndex(
                name: "IX_BomStructures_NodeVersionId",
                table: "BomStructures",
                column: "NodeVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_BomStructures_ParentId",
                table: "BomStructures",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_BomStructures_RootVersionId",
                table: "BomStructures",
                column: "RootVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersions_ProductId",
                table: "ProductVersions",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ParentId",
                table: "Reports",
                column: "ParentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Post");

            migrationBuilder.DropTable(
                name: "BomStructures");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "Blog");

            migrationBuilder.DropTable(
                name: "ProductVersions");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
