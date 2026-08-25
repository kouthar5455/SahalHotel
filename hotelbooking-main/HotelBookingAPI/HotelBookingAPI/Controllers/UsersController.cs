using HotelBookingAPI.Data;
using HotelBookingAPI.Helpers;
using HotelBookingAPI.Models;
using HotelBookingAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;

        private static readonly string[] ValidRoles = { "Admin", "User" };

        public UsersController(UserManager<ApplicationUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? page, [FromQuery] int? pageSize)
        {
            var users = await _userManager.Users
                .OrderByDescending(u => u.CreatedAt)
                .Paginate(page, pageSize)
                .ToListAsync();

            var result = new List<object>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    role = roles.FirstOrDefault(),
                    createdAt = user.CreatedAt
                });
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                role = roles.FirstOrDefault(),
                createdAt = user.CreatedAt
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDto dto)
        {
            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null)
                return BadRequest(new { message = "A user with this email already exists" });

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

            await _userManager.AddToRoleAsync(user, dto.Role);
            return Ok(new { message = "User created", userId = user.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            // If the email changed, make sure it isn't taken by someone else
            if (!string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var other = await _userManager.FindByEmailAsync(dto.Email);
                if (other != null && other.Id != user.Id)
                    return BadRequest(new { message = "A user with this email already exists" });

                user.Email = dto.Email;
                user.UserName = dto.Email;
            }

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

            return Ok(new { message = "User updated" });
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(string id, ChangeRoleDto dto)
        {
            if (!ValidRoles.Contains(dto.Role))
                return BadRequest(new { message = "Invalid role. Allowed roles are Admin and User." });

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id == currentUserId)
                return BadRequest(new { message = "You cannot change your own role." });

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok(new { message = $"Role changed to {dto.Role}" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id == currentUserId)
                return BadRequest(new { message = "You cannot delete your own account." });

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            var bookings = await _context.Bookings.Where(b => b.UserId == id).ToListAsync();
            if (bookings.Any(b => b.Status == "Pending" || b.Status == "Confirmed"))
                return BadRequest(new { message = "Cannot delete a user with active bookings." });

            // Booking -> User is Restrict, so remove leftover (cancelled) bookings first.
            _context.Bookings.RemoveRange(bookings);
            await _context.SaveChangesAsync();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

            return Ok(new { message = "User deleted" });
        }
    }
}
