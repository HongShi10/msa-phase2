﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace SongBank.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SongItem",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    Youtube = table.Column<string>(nullable: true),
                    Genre = table.Column<string>(nullable: true),
                    Width = table.Column<string>(nullable: true),
                    Height = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongItem", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SongItem");
        }
    }
}
