using HotelBookingAPI.Data;
using HotelBookingAPI.Helpers;
using HotelBookingAPI.Models;
using HotelBookingAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(BookingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (dto.CheckInDate.Date < DateTime.UtcNow.Date)
                return BadRequest(new { message = "Check-in date cannot be in the past" });

            if (dto.CheckOutDate <= dto.CheckInDate)
                return BadRequest(new { message = "Check-out date must be after check-in date" });

            var room = await _context.Rooms.FindAsync(dto.RoomId);
            if (room == null) return NotFound(new { message = "Room not found" });

            using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);
            try
            {
                var overlap = await _context.Bookings
                    .Where(b => b.RoomId == dto.RoomId)
                    .Where(b => b.Status != "Cancelled")
                    .Where(b => dto.CheckInDate < b.CheckOutDate && dto.CheckOutDate > b.CheckInDate)
                    .AnyAsync();

                if (overlap)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new { message = "Room is not available for the selected dates" });
                }

                var nights = (dto.CheckOutDate - dto.CheckInDate).Days;
                var totalPrice = room.PricePerNight * nights;

                var booking = new Booking
                {
                    UserId = userId!,
                    HotelId = room.HotelId,
                    RoomId = dto.RoomId,
                    CheckInDate = dto.CheckInDate,
                    CheckOutDate = dto.CheckOutDate,
                    TotalPrice = totalPrice,
                    PaymentMethod = dto.PaymentMethod,
                    Status = "Pending"
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Booking created", bookingId = booking.Id });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings([FromQuery] int? page, [FromQuery] int? pageSize)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var query = _context.Bookings
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .AsQueryable();

            query = query.Paginate(page, pageSize);

            var bookings = await query
                .Select(b => new
                {
                    b.Id,
                    b.CheckInDate,
                    b.CheckOutDate,
                    b.TotalPrice,
                    b.Status,
                    b.PaymentMethod,
                    b.CreatedAt,
                    hotel = new { b.Hotel.Id, b.Hotel.Name },
                    room = new { b.Room.Id, b.Room.RoomType }
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null) return NotFound();
            if (booking.UserId != userId) return Forbid();
            if (booking.Status == "Cancelled") return BadRequest(new { message = "This booking is already cancelled" });
            if (booking.Status != "Pending" && booking.Status != "Confirmed")
                return BadRequest(new { message = "This booking can no longer be cancelled" });

            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Booking cancelled" });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] int? page, [FromQuery] int? pageSize)
        {
            var query = _context.Bookings
                .OrderByDescending(b => b.CreatedAt)
                .AsQueryable();

            query = query.Paginate(page, pageSize);

            var bookings = await query
                .Select(b => new
                {
                    b.Id,
                    b.CheckInDate,
                    b.CheckOutDate,
                    b.TotalPrice,
                    b.Status,
                    b.PaymentMethod,
                    b.CreatedAt,
                    user = new { b.User.Id, b.User.FullName, b.User.Email },
                    hotel = new { b.Hotel.Id, b.Hotel.Name },
                    room = new { b.Room.Id, b.Room.RoomType }
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Confirm(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();
            booking.Status = "Confirmed";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Booking confirmed" });
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();
            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Booking rejected" });
        }
    }
}