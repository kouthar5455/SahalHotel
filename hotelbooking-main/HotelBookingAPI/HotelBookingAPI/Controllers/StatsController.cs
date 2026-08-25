using HotelBookingAPI.Data;
using HotelBookingAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous] // public aggregate counts shown on the landing page's "By The Numbers" section
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public StatsController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetStats()
        {
            var totalHotels = await _context.Hotels.CountAsync();
            var totalRooms = await _context.Rooms.CountAsync();
            var totalBookings = await _context.Bookings.CountAsync();
            var totalCustomers = (await _userManager.GetUsersInRoleAsync("User")).Count;

            return Ok(new
            {
                totalHotels,
                totalRooms,
                totalBookings,
                totalCustomers
            });
        }
    }
}
