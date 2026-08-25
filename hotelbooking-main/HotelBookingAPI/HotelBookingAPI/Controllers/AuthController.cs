using HotelBookingAPI.Models;
using HotelBookingAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
//Malyuun part 
namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration config, IWebHostEnvironment env)
        {
            _userManager = userManager;
            _config = config;
            _env = env;
        }

        [HttpPost("register")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
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

            await _userManager.AddToRoleAsync(user, "User");
            return Ok(new { message = "Account created successfully" });
        }

        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            if (await _userManager.IsLockedOutAsync(user))
                return StatusCode(StatusCodes.Status423Locked, new { message = "Account locked due to multiple failed login attempts. Please try again later." });

            var isValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isValid)
            {
                await _userManager.AccessFailedAsync(user);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            await _userManager.ResetAccessFailedCountAsync(user);

            // "Remember me" controls how long the session lives. Both the token and the
            // cookie use the same lifetime so an un-remembered session can't be revived
            // past its short window (e.g. via browser session restore).
            var tokenLifetime = dto.RememberMe ? TimeSpan.FromDays(7) : TimeSpan.FromHours(8);
            var token = await GenerateJwtTokenAsync(user, tokenLifetime);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !_env.IsDevelopment(),
                SameSite = SameSiteMode.Lax
            };

            // Persistent cookie only when "Remember me" is checked; otherwise a session
            // cookie the browser drops when it closes.
            if (dto.RememberMe)
                cookieOptions.Expires = DateTimeOffset.UtcNow.Add(tokenLifetime);

            Response.Cookies.Append("access_token", token, cookieOptions);

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { message = "Login successful", role = roles.FirstOrDefault() });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            return Ok(new { message = "Logged out" });
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return NotFound(new { message = "No account found with this email" });

            // Generate and immediately consume a reset token so the new password is
            // hashed and validated through Identity (never stored as plain text).
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

            // Clear any lockout / failed-attempt count so a user who reset precisely
            // because they were locked out can log in immediately with the new password.
            await _userManager.SetLockoutEndDateAsync(user, null);
            await _userManager.ResetAccessFailedCountAsync(user);

            return Ok(new { message = "Password reset successfully. You can now log in." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = roles.FirstOrDefault()
            });
        }

        private async Task<string> GenerateJwtTokenAsync(ApplicationUser user, TimeSpan lifetime)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.FullName)
            };
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.Add(lifetime),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
