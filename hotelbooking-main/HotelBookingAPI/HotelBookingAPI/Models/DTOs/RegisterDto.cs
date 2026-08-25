using System.ComponentModel.DataAnnotations;

namespace HotelBookingAPI.Models.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^061\d{7}$", ErrorMessage = "Phone number must start with 061 and be exactly 10 digits long")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}