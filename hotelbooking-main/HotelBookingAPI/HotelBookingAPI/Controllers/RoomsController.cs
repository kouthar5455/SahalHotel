using HotelBookingAPI.Data;
using HotelBookingAPI.Models;
using HotelBookingAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetByHotel([FromQuery] int hotelId)
        {
            var rooms = await _context.Rooms
                .Where(r => r.HotelId == hotelId)
                .ToListAsync();
            return Ok(rooms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null) return NotFound(new { message = "Room not found" });
            return Ok(room);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(RoomDto dto)
        {
            var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == dto.HotelId);
            if (!hotelExists) return NotFound(new { message = "Hotel not found" });

            var room = new Room
            {
                HotelId = dto.HotelId,
                RoomType = dto.RoomType,
                Description = dto.Description,
                PricePerNight = dto.PricePerNight,
                Capacity = dto.Capacity
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Room created", roomId = room.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, RoomDto dto)
        {
            var existing = await _context.Rooms.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Room not found" });

            existing.RoomType = dto.RoomType;
            existing.Description = dto.Description;
            existing.PricePerNight = dto.PricePerNight;
            existing.Capacity = dto.Capacity;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Room updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Bookings)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null) return NotFound(new { message = "Room not found" });

            var activeBookings = room.Bookings
                .Where(b => b.Status == "Pending" || b.Status == "Confirmed")
                .Count();

            if (activeBookings > 0)
                return BadRequest(new { message = "Cannot delete. Active bookings exist." });

            // Booking -> Room is Restrict, so remove leftover (cancelled) bookings first.
            _context.Bookings.RemoveRange(room.Bookings);
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Room deleted" });
        }
    }
}