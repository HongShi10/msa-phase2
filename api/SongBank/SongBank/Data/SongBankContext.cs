using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SongBank.Models
{
    public class SongBankContext : DbContext
    {
        public SongBankContext (DbContextOptions<SongBankContext> options)
            : base(options)
        {
        }

        public DbSet<SongBank.Models.SongItem> SongItem { get; set; }
    }
}
