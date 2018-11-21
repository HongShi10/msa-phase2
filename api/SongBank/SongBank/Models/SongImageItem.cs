using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SongBank.Models
{
    public class SongImageItem
    {
        public string Title { get; set; }
        public string Genre { get; set; }
        public IFormFile Image { get; set; }
    }
}