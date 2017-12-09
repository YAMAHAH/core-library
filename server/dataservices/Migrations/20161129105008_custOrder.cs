using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace dataservices.Migrations
{
    public partial class custOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrderHeaders",
                columns: table => new
                {
                    OrderHeaderId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    CreateDate = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    CustomerOrderNo = table.Column<string>(nullable: true),
                    OrderDelivery = table.Column<DateTime>(nullable: true),
                    OrderHeaderNo = table.Column<string>(nullable: true),
                    PartnerId = table.Column<int>(nullable: false),
                    SF_Cancel = table.Column<bool>(nullable: false),
                    SF_Finish = table.Column<bool>(nullable: false),
                    UpdateDate = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAddOrUpdate", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderHeaders", x => x.OrderHeaderId);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    OrderDetailId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    CostPrice = table.Column<double>(nullable: false),
                    CustomerOrderNo = table.Column<string>(nullable: true),
                    DisCount = table.Column<double>(nullable: false),
                    Ord = table.Column<int>(nullable: false),
                    OrderDetailDelivery = table.Column<DateTime>(nullable: true),
                    OrderFinishTotal = table.Column<double>(nullable: false),
                    OrderHeaderId = table.Column<int>(nullable: false),
                    OrderLeftTotal = table.Column<double>(nullable: false),
                    OrderTotal = table.Column<double>(nullable: false),
                    Price = table.Column<double>(nullable: false),
                    ProductVersionId = table.Column<int>(nullable: false),
                    Rem = table.Column<string>(nullable: true),
                    SF_MxFin = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.OrderDetailId);
                    table.ForeignKey(
                        name: "FK_OrderDetails_OrderHeaders_OrderHeaderId",
                        column: x => x.OrderHeaderId,
                        principalTable: "OrderHeaders",
                        principalColumn: "OrderHeaderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetails_ProductVersions_ProductVersionId",
                        column: x => x.ProductVersionId,
                        principalTable: "ProductVersions",
                        principalColumn: "ProductVersionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderHeaderId",
                table: "OrderDetails",
                column: "OrderHeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductVersionId",
                table: "OrderDetails",
                column: "ProductVersionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "OrderHeaders");
        }
    }
}
