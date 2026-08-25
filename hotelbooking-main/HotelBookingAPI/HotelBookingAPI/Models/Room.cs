namespace HotelBookingAPI.Models
{
    public class Room
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string RoomType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public int Capacity { get; set; }

        public Hotel Hotel { get; set; } = null!;
        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}