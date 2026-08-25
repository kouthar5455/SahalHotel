using System.ComponentModel.DataAnnotations;

namespace HotelBookingAPI.Models.DTOs
{
    public class BookingDto
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [Required]
        [RegularExpression("EVC|VISA", ErrorMessage = "Payment method must be EVC or VISA")]
        public string PaymentMethod { get; set; } = string.Empty;
    }
}