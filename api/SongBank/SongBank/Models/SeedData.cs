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
                        Title = "The Climb",
                        Youtube = "https://www.youtube.com/watch?v=NG2zyeVRcbs",
                        Tags = "Miley Cyrus",
                        Uploaded = "07-10-18 4:20T18:25:43.511Z",

                    }


                );
                context.SaveChanges();
            }
        }
    }
}