using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using SongBank.Helpers;
using SongBank.Models;

namespace SongBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongItemsController : ControllerBase
    {
        private readonly SongBankContext _context;
        private IConfiguration _configuration;

        public SongItemsController(SongBankContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/SongItems
        [HttpGet]
        public IEnumerable<SongItem> GetSongItem()
        {
            return _context.SongItem;
        }

        // GET: api/SongItems/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSongItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var songItem = await _context.SongItem.FindAsync(id);

            if (songItem == null)
            {
                return NotFound();
            }

            return Ok(songItem);
        }

        // PUT: api/SongItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSongItem([FromRoute] int id, [FromBody] SongItem songItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != songItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(songItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SongItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SongItems
        [HttpPost]
        public async Task<IActionResult> PostSongItem([FromBody] SongItem songItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.SongItem.Add(songItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSongItem", new { id = songItem.Id }, songItem);
        }

        // DELETE: api/SongItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSongItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var songItem = await _context.SongItem.FindAsync(id);
            if (songItem == null)
            {
                return NotFound();
            }

            _context.SongItem.Remove(songItem);
            await _context.SaveChangesAsync();

            return Ok(songItem);
        }

        private bool SongItemExists(int id)
        {
            return _context.SongItem.Any(e => e.Id == id);
        }

        // GET: api/SongItem/Tags
        [Route("tags")]
        [HttpGet]
        public async Task<List<string>> GetTags()
        {
            var memes = (from m in _context.SongItem
                         select m.Tags).Distinct();

            var returned = await memes.ToListAsync();

            return returned;
        }
        // GET: api/SongItem/Tags

        [HttpGet]
        [Route("tag")]
        public async Task<List<SongItem>> GetTagsItem([FromQuery] string tags)
        {
            var memes = from m in _context.SongItem
                        select m; //get all the songs


            if (!String.IsNullOrEmpty(tags)) //make sure user gave a tag to search
            {
                memes = memes.Where(s => s.Tags.ToLower().Equals(tags.ToLower())); // find the entries with the search tag and reassign
            }

            var returned = await memes.ToListAsync(); //return the songs

            return returned;
        }
        [HttpPost, Route("upload")]
        public async Task<IActionResult> UploadFile([FromForm]SongImageItem song)
        {
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest($"Expected a multipart request, but got {Request.ContentType}");
            }
            try
            {
                using (var stream = song.Image.OpenReadStream())
                {
                    var cloudBlock = await UploadToBlob(song.Image.FileName, null, stream);
                    //// Retrieve the filename of the file you have uploaded
                    //var filename = provider.FileData.FirstOrDefault()?.LocalFileName;
                    if (string.IsNullOrEmpty(cloudBlock.StorageUri.ToString()))
                    {
                        return BadRequest("An error has occured while uploading your file. Please try again.");
                    }

                    SongItem songItem = new SongItem();
                    songItem.Title = song.Title;
                    songItem.Tags = song.Tags;

                    System.Drawing.Image image = System.Drawing.Image.FromStream(stream);
                    songItem.Height = image.Height.ToString();
                    songItem.Width = image.Width.ToString();
                    songItem.Url = cloudBlock.SnapshotQualifiedUri.AbsoluteUri;
                    songItem.Uploaded = DateTime.Now.ToString();
                    songItem.Youtube = song.Youtube;


                    _context.SongItem.Add(songItem);
                    await _context.SaveChangesAsync();

                    return Ok($"File: {song.Title} has successfully uploaded");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"An error has occured. Details: {ex.Message}");
            }


        }

        private async Task<CloudBlockBlob> UploadToBlob(string filename, byte[] imageBuffer = null, System.IO.Stream stream = null)
        {

            var accountName = _configuration["AzureBlob:name"];
            var accountKey = _configuration["AzureBlob:key"]; ;
            var storageAccount = new CloudStorageAccount(new StorageCredentials(accountName, accountKey), true);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            CloudBlobContainer imagesContainer = blobClient.GetContainerReference("images");

            string storageConnectionString = _configuration["AzureBlob:connectionString"];

            // Check whether the connection string can be parsed.
            if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
            {
                try
                {
                    // Generate a new filename for every new blob
                    var fileName = Guid.NewGuid().ToString();
                    fileName += GetFileExtention(filename);

                    // Get a reference to the blob address, then upload the file to the blob.
                    CloudBlockBlob cloudBlockBlob = imagesContainer.GetBlockBlobReference(fileName);

                    if (stream != null)
                    {
                        await cloudBlockBlob.UploadFromStreamAsync(stream);
                    }
                    else
                    {
                        return new CloudBlockBlob(new Uri(""));
                    }

                    return cloudBlockBlob;
                }
                catch (StorageException ex)
                {
                    return new CloudBlockBlob(new Uri(""));
                }
            }
            else
            {
                return new CloudBlockBlob(new Uri(""));
            }

        }

        private string GetFileExtention(string fileName)
        {
            if (!fileName.Contains("."))
                return ""; //no extension
            else
            {
                var extentionList = fileName.Split('.');
                return "." + extentionList.Last(); //assumes last item is the extension 
            }
        }
    }
}