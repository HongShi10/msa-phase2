using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SongBank.Models
{
    public class SongItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string Youtube { get; set; }
        public string Genre { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
    }
}
