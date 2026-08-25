using System.ComponentModel.DataAnnotations;

namespace HotelBookingAPI.Models.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [RegularExpression(@"^061\d{7}$", ErrorMessage = "Phone number must start with 061 and be exactly 10 digits long")]
        public string? PhoneNumber { get; set; }
    }

    public class CreateUserDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [RegularExpression(@"^061\d{7}$", ErrorMessage = "Phone number must start with 061 and be exactly 10 digits long")]
        public string? PhoneNumber { get; set; }

        [Required]
        [RegularExpression("Admin|User", ErrorMessage = "Role must be Admin or User")]
        public string Role { get; set; } = "User";
    }

    public class ChangeRoleDto
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
