using HotelBookingAPI.Data;
using HotelBookingAPI.Helpers;
using HotelBookingAPI.Models;
using HotelBookingAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private static readonly string[] AllowedContentTypes = { "image/jpeg", "image/png", "image/webp" };
        private const long MaxImageSize = 5 * 1024 * 1024; // 5 MB
        private const string UploadsFolder = "uploads/hotels";

        public HotelsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private string UploadsDirectory =>
            Path.Combine(
                _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"),
                "uploads",
                "hotels");

        private void DeleteImageFile(string? relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath)) return;
            if (!relativePath.StartsWith("/" + UploadsFolder)) return; // only manage our own uploads

            var fileName = Path.GetFileName(relativePath);
            var fullPath = Path.Combine(UploadsDirectory, fileName);
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int? capacity,
            [FromQuery] string? sortBy,
            [FromQuery] int? page,
            [FromQuery] int? pageSize)
        {
            if (minPrice.HasValue && minPrice.Value < 0)
                return BadRequest(new { message = "Minimum price cannot be negative" });

            if (maxPrice.HasValue && maxPrice.Value < 0)
                return BadRequest(new { message = "Maximum price cannot be negative" });

            if (minPrice.HasValue && maxPrice.HasValue && minPrice.Value > maxPrice.Value)
                return BadRequest(new { message = "Minimum price cannot be greater than maximum price" });

            if (capacity.HasValue && capacity.Value < 1)
                return BadRequest(new { message = "Capacity must be at least 1" });

            var query = _context.Hotels.Include(h => h.Rooms).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(h => h.Name.Contains(search) || h.Location.Contains(search));
            }

            if (minPrice.HasValue || maxPrice.HasValue || capacity.HasValue)
            {
                query = query.Where(h => h.Rooms.Any(r =>
                    (!minPrice.HasValue || r.PricePerNight >= minPrice.Value) &&
                    (!maxPrice.HasValue || r.PricePerNight <= maxPrice.Value) &&
                    (!capacity.HasValue || r.Capacity >= capacity.Value)));
            }

            query = sortBy switch
            {
                "priceAsc" => query.OrderBy(h => h.Rooms.Min(r => (decimal?)r.PricePerNight)),
                "priceDesc" => query.OrderByDescending(h => h.Rooms.Min(r => (decimal?)r.PricePerNight)),
                _ => query
            };

            var hotels = await query.Paginate(page, pageSize).ToListAsync();
            return Ok(hotels);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var hotel = await _context.Hotels
                .Include(h => h.Rooms)
                .FirstOrDefaultAsync(h => h.Id == id);
            if (hotel == null) return NotFound(new { message = "Hotel not found" });
            return Ok(hotel);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(HotelDto dto)
        {
            var hotel = new Hotel
            {
                Name = dto.Name,
                Location = dto.Location,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl
            };

            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Hotel created", hotelId = hotel.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, HotelDto dto)
        {
            var existing = await _context.Hotels.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Hotel not found" });

            // If the image changed, remove the old uploaded file
            if (existing.ImageUrl != dto.ImageUrl)
                DeleteImageFile(existing.ImageUrl);

            existing.Name = dto.Name;
            existing.Location = dto.Location;
            existing.Description = dto.Description;
            existing.ImageUrl = dto.ImageUrl;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Hotel updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var hotel = await _context.Hotels
                .Include(h => h.Rooms)
                .ThenInclude(r => r.Bookings)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hotel == null) return NotFound(new { message = "Hotel not found" });

            var activeBookings = hotel.Rooms
                .SelectMany(r => r.Bookings)
                .Where(b => b.Status == "Pending" || b.Status == "Confirmed")
                .Count();

            if (activeBookings > 0)
                return BadRequest(new { message = "Cannot delete. Active bookings exist." });

            DeleteImageFile(hotel.ImageUrl);

            // Hotel -> Room and Room -> Booking are Restrict (no cascade), so the
            // dependent rows must be removed explicitly before the hotel itself.
            var bookings = hotel.Rooms.SelectMany(r => r.Bookings).ToList();
            _context.Bookings.RemoveRange(bookings);
            _context.Rooms.RemoveRange(hotel.Rooms);
            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Hotel deleted" });
        }

        [HttpPost("upload-image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            if (file.Length > MaxImageSize)
                return BadRequest(new { message = "Image must be 5 MB or smaller" });

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest(new { message = "Only .jpg, .jpeg, .png and .webp files are allowed" });

            if (!AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
                return BadRequest(new { message = "Invalid image format" });

            Directory.CreateDirectory(UploadsDirectory);

            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(UploadsDirectory, fileName);

            using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"/{UploadsFolder}/{fileName}";
            return Ok(new { imageUrl = relativePath });
        }

        [HttpDelete("image")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteImage([FromQuery] string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                return BadRequest(new { message = "No image path provided" });

            DeleteImageFile(path);
            return Ok(new { message = "Image deleted" });
        }
    }
}