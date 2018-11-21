using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SongBank.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new SongBankContext(
                serviceProvider.GetRequiredService<DbContextOptions<SongBankContext>>()))
            {
                // Look for any movies.
                if (context.SongItem.Count() > 0)
                {
                    return;   // DB has been seeded
                }

                context.SongItem.AddRange(
                    new SongItem
                    {
                        Title = "Is Mayo an Instrument?",
                        Url = "https://i.kym-cdn.com/photos/images/original/001/371/723/be6.jpg",
                        Youtube = "https://www.youtube.com/watch?v=Bxpdqc84hQI",
                        Genre = "spongebob",
                        Width = "768",
                        Height = "432"
                    }


                );
                context.SaveChanges();
            }
        }
    }
}