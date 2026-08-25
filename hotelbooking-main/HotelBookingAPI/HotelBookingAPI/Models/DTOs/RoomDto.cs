using System.ComponentModel.DataAnnotations;

namespace HotelBookingAPI.Models.DTOs
{
    public class RoomDto
    {
        [Required]
        public int HotelId { get; set; }

        [Required]
        public string RoomType { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal PricePerNight { get; set; }

        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }
    }
}
