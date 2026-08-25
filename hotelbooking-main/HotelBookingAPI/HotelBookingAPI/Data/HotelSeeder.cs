using HotelBookingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingAPI.Data
{
    public static class HotelSeeder
    {
        private static readonly Hotel[] Hotels =
        {
            new() { Name = "Jazeera Palace Hotel", Location = "Jazeera, Mogadishu",
                Description = "An iconic seaside palace hotel offering refined comfort and sweeping ocean views.",
                ImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Peace Hotel Mogadishu", Location = "KM4, Hodan District, Mogadishu",
                Description = "A trusted city hotel in the heart of KM4 with modern rooms and warm hospitality.",
                ImageUrl = "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Ocean View Hotel", Location = "Lido Beach, Abdiaziz District, Mogadishu",
                Description = "Beachfront rooms steps from Lido Beach, perfect for a relaxing coastal stay.",
                ImageUrl = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "City Star Hotel", Location = "Waberi District, Mogadishu",
                Description = "A bright, central hotel close to the city's business and shopping districts.",
                ImageUrl = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Safari Palace Hotel", Location = "Hodan District, Mogadishu",
                Description = "Spacious suites and lush courtyards blending traditional charm with modern amenities.",
                ImageUrl = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Elite Grand Hotel", Location = "Lido Beach, Mogadishu",
                Description = "An upscale beachside retreat featuring elegant rooms and premium service.",
                ImageUrl = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Banadir Royal Hotel", Location = "Shangani District, Mogadishu",
                Description = "A historic-district hotel offering royal comfort near the old town and coast.",
                ImageUrl = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Muqdisho Plaza Hotel", Location = "KM5, Hodan District, Mogadishu",
                Description = "A contemporary plaza hotel at busy KM5 with conference and dining facilities.",
                ImageUrl = "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Blue Sky Hotel", Location = "Taleh, Hodan District, Mogadishu",
                Description = "Calm, airy rooms with rooftop views over the Hodan skyline.",
                ImageUrl = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Harbor View Hotel", Location = "Hamar Weyne, Mogadishu Port Area",
                Description = "Overlooking the historic port, ideal for travelers who love the waterfront.",
                ImageUrl = "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Golden Sands Hotel", Location = "Lido Beach, Mogadishu",
                Description = "Golden-sand beachfront living with sunlit rooms and a seaside terrace.",
                ImageUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Somali Star Hotel", Location = "Hamar Jajab District, Mogadishu",
                Description = "A comfortable mid-city hotel known for its friendly staff and local cuisine.",
                ImageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Green Garden Hotel", Location = "Madina District, Mogadishu",
                Description = "A tranquil garden hotel offering a peaceful escape from the city bustle.",
                ImageUrl = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Central Park Hotel", Location = "Bondhere District, Mogadishu",
                Description = "Centrally located with easy access to markets, offices and landmarks.",
                ImageUrl = "https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=800&q=80" },
            new() { Name = "Pearl Crown Hotel", Location = "Karan District, Mogadishu",
                Description = "A polished, modern hotel delivering crown-worthy comfort in Karan.",
                ImageUrl = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80" },
        };

        public static async Task SeedAsync(AppDbContext context)
        {
            foreach (var hotel in Hotels)
            {
                var exists = await context.Hotels.AnyAsync(h => h.Name == hotel.Name);
                if (!exists)
                {
                    context.Hotels.Add(new Hotel
                    {
                        Name = hotel.Name,
                        Location = hotel.Location,
                        Description = hotel.Description,
                        ImageUrl = hotel.ImageUrl
                    });
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
