-- ============================================================
--  Hotel Booking – seed data (15 hotels, ~14 rooms each)
--  Run against the `hotelbooking` MySQL database.
--
--  PREREQUISITE: the Rooms.Description column must exist.
--  If you have not applied it yet, run this once first:
--      dotnet ef database update
--  (from HotelBookingAPI/HotelBookingAPI) — it applies the
--  AddRoomDescription migration. Otherwise the room INSERT
--  below will fail because Description is NOT NULL.
-- ============================================================

USE hotelbooking;

-- ---------- 1. Hotels (15) ----------
-- Id is auto-increment; each hotel gets a distinct real image URL.
INSERT INTO Hotels (Name, Location, Description, ImageUrl) VALUES
('Jazeera Palace Hotel',  'Jazeera, Mogadishu',                       'A landmark hotel offering refined comfort, secure grounds and attentive service in the heart of Jazeera.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'),
('Peace Hotel Mogadishu', 'KM4, Hodan District, Mogadishu',           'Centrally located at KM4 with modern rooms, meeting facilities and easy access to the city.',              'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'),
('Ocean View Hotel',      'Lido Beach, Abdiaziz District, Mogadishu',  'Beachfront stay on Lido Beach with sweeping ocean views and a relaxed seaside atmosphere.',                'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'),
('City Star Hotel',       'Waberi District, Mogadishu',                'Comfortable, well-priced rooms in Waberi, ideal for both business and leisure travellers.',                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'),
('Safari Palace Hotel',   'Hodan District, Mogadishu',                 'Elegant rooms and warm hospitality in the bustling Hodan District.',                                       'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'),
('Elite Grand Hotel',     'Lido Beach, Mogadishu',                     'An upscale retreat near Lido Beach featuring spacious suites and premium amenities.',                       'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'),
('Banadir Royal Hotel',   'Shangani District, Mogadishu',              'Historic charm meets modern comfort in the coastal Shangani District.',                                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'),
('Muqdisho Plaza Hotel',  'KM5, Hodan District, Mogadishu',            'A contemporary plaza hotel at KM5 with bright rooms and a central location.',                              'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'),
('Blue Sky Hotel',        'Taleh, Hodan District, Mogadishu',          'Calm, comfortable rooms in Taleh with friendly service and good value.',                                   'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
('Harbor View Hotel',     'Hamar Weyne, Mogadishu Port Area',          'Overlooking the port at Hamar Weyne, offering convenient access and harbour views.',                       'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'),
('Golden Sands Hotel',    'Lido Beach, Mogadishu',                     'Sun-filled rooms steps from the golden sands of Lido Beach.',                                              'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80'),
('Somali Star Hotel',     'Hamar Jajab District, Mogadishu',           'A dependable city hotel in Hamar Jajab with clean, cozy rooms.',                                           'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'),
('Green Garden Hotel',    'Madina District, Mogadishu',                'A tranquil garden setting in Madina District, perfect for a restful stay.',                                'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'),
('Central Park Hotel',    'Bondhere District, Mogadishu',              'Modern rooms in central Bondhere, close to markets and business hubs.',                                    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'),
('Pearl Crown Hotel',     'Karan District, Mogadishu',                 'A polished stay in Karan District with premium finishes and quiet comfort.',                               'https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=800&q=80');


-- ---------- 2. Rooms (14 per hotel) ----------
-- Cross-joins a 14-row room template onto each of the 15 hotels above,
-- so every hotel gets exactly 14 rooms (within the 10–20 requirement).
-- Descriptions/capacities follow the predefined room-type table.
INSERT INTO Rooms (HotelId, RoomType, Description, PricePerNight, Capacity)
SELECT h.Id, t.RoomType, t.Description, t.PricePerNight, t.Capacity
FROM Hotels h
JOIN (
              SELECT 'Single Room'     AS RoomType, 'One single bed for one person'                            AS Description,  40.00 AS PricePerNight, 1 AS Capacity
    UNION ALL SELECT 'Standard Room',       'Basic room with essential amenities',                                            55.00, 2
    UNION ALL SELECT 'Standard Room',       'Basic room with essential amenities',                                            58.00, 2
    UNION ALL SELECT 'Double Room',         'One double/queen bed',                                                           70.00, 2
    UNION ALL SELECT 'Double Room',         'One double/queen bed',                                                           72.00, 2
    UNION ALL SELECT 'Twin Room',           'Two separate single beds',                                                       68.00, 2
    UNION ALL SELECT 'Twin Room',           'Two separate single beds',                                                       70.00, 2
    UNION ALL SELECT 'Triple Room',         'Three single beds or one double and one single bed',                            90.00, 3
    UNION ALL SELECT 'Superior Room',       'Better view and more amenities than Standard Room',                             95.00, 3
    UNION ALL SELECT 'Deluxe Room',         'Larger room with upgraded furnishings',                                        120.00, 3
    UNION ALL SELECT 'Deluxe Room',         'Larger room with upgraded furnishings',                                        125.00, 3
    UNION ALL SELECT 'Executive Room',      'Designed for business travelers with premium facilities',                      150.00, 2
    UNION ALL SELECT 'Family Room',         'Multiple beds suitable for families',                                          140.00, 4
    UNION ALL SELECT 'Family Room',         'Multiple beds suitable for families',                                          165.00, 6
) AS t
WHERE h.Name IN (
    'Jazeera Palace Hotel','Peace Hotel Mogadishu','Ocean View Hotel','City Star Hotel','Safari Palace Hotel',
    'Elite Grand Hotel','Banadir Royal Hotel','Muqdisho Plaza Hotel','Blue Sky Hotel','Harbor View Hotel',
    'Golden Sands Hotel','Somali Star Hotel','Green Garden Hotel','Central Park Hotel','Pearl Crown Hotel'
);


-- ---------- 3. Quick verification ----------
SELECT h.Name, COUNT(r.Id) AS RoomCount
FROM Hotels h
LEFT JOIN Rooms r ON r.HotelId = h.Id
GROUP BY h.Id, h.Name
ORDER BY h.Id;
