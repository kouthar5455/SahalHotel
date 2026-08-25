-- ============================================================
--  Seed 20 users (+ one booking each) for the hotelbooking DB.
--  Shared login password for every seeded user: Password123!
--
--  PREREQUISITES (apply migrations first):
--    - AspNetUsers.CreatedAt column  (AddUserCreatedAt migration)
--    - Bookings.PaymentMethod column (AddUserCreatedAtAndPaymentMethod)
--    - Hotels/Rooms already seeded    (run seed-data.sql first)
--  Run:  dotnet ef database update   then this script.
-- ============================================================

USE hotelbooking;

-- ---------- Users ----------
INSERT INTO AspNetUsers
  (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
   PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed,
   TwoFactorEnabled, LockoutEnabled, AccessFailedCount, FullName, CreatedAt)
VALUES
  ('9c39f018-1efe-43be-b3b6-1c893769b703', 'ahmed.hassan@example.com', 'AHMED.HASSAN@EXAMPLE.COM', 'ahmed.hassan@example.com', 'AHMED.HASSAN@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAELoOhoCcIFa9VWVwaysn/hpM1mxu6QaD2AGsousO1JIb3LTsCBrF8s5Mf0zPIEK0HQ==', 'f6cead53-5cc9-49e6-aa9b-d0372581f5c7', '7bacb71a-276b-485a-a7f7-84528f0300f5', '0610000001', 0, 0, 1, 0, 'Ahmed Hassan', '2026-07-01 11:16:10'),
  ('ee098b45-81d8-4f38-89ca-f9f4466fee54', 'mohamed.ali@example.com', 'MOHAMED.ALI@EXAMPLE.COM', 'mohamed.ali@example.com', 'MOHAMED.ALI@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAECeJCVSUVR7p8J8eE+9BhBo6oXpN0U7eVgI3KwLpGb7Tmnop+DveKTn+euVUPkKjpQ==', '13297c88-5ffc-4062-a010-de9ac778b04d', '4d55e8a3-cf71-42b5-9207-ff0e4a5b045e', '0610000002', 0, 0, 1, 0, 'Mohamed Ali', '2026-06-28 11:16:10'),
  ('823e3f90-14c3-4b32-ba3d-375372cee23e', 'abdirahman.mohamed@example.com', 'ABDIRAHMAN.MOHAMED@EXAMPLE.COM', 'abdirahman.mohamed@example.com', 'ABDIRAHMAN.MOHAMED@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEI5xQR0QZ7vK0llZyKjf6wZOW0zLwqQfRIEyP1SZj3MANeIZwrKDxjjFhtkkx4RT2w==', '6191d439-8f49-4401-9c10-17654c193f6f', '5a4150f6-ed78-4db5-a8cd-ec4f13c37cb5', '0610000003', 0, 0, 1, 0, 'Abdirahman Mohamed', '2026-06-25 11:16:10'),
  ('9eaeaab2-f32c-4c7f-ad3b-6b222b8a9721', 'abdullahi.yusuf@example.com', 'ABDULLAHI.YUSUF@EXAMPLE.COM', 'abdullahi.yusuf@example.com', 'ABDULLAHI.YUSUF@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEL2qkUE+B5JKGYqcuJCz6pCa7+QbJd1xztRn4AIiokBBVi8dS+J8smn3Lhr4E7POnA==', 'd6976c09-51ea-4d1d-b361-3b075e0eade1', 'e4588f84-b186-4f6e-9b4d-805fb921ebde', '0610000004', 0, 0, 1, 0, 'Abdullahi Yusuf', '2026-06-22 11:16:10'),
  ('16145905-65cf-4493-abe4-a083e740e84e', 'hassan.ibrahim@example.com', 'HASSAN.IBRAHIM@EXAMPLE.COM', 'hassan.ibrahim@example.com', 'HASSAN.IBRAHIM@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEL+TOEympRR4S5PleL6d138NN32D2GTBEpogRZ+w/WAzBBvI+A9viV7r5VpeyXJInw==', 'ffb4df17-12bf-4944-8323-3273d1d31c0a', '856bdd67-4596-4aba-8f2c-0a09da05c9ee', '0610000005', 0, 0, 1, 0, 'Hassan Ibrahim', '2026-06-19 11:16:10'),
  ('660811ad-d9c0-409d-843f-9c95cc4e3f64', 'omar.farah@example.com', 'OMAR.FARAH@EXAMPLE.COM', 'omar.farah@example.com', 'OMAR.FARAH@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEF/YvzYz87h3CsJViYOVKUcN1Z3A+JJgYC1CeiM79SrAPtmnTqid/u6zdnaOcX9+dA==', '9cfa0691-0945-4148-a02e-e80ad2236c25', '4a066a7b-d841-49ab-8e22-03fc51d49603', '0610000006', 0, 0, 1, 0, 'Omar Farah', '2026-06-16 11:16:10'),
  ('d8018937-65c3-4b75-aaf9-8d07ff9c2ccd', 'ismail.noor@example.com', 'ISMAIL.NOOR@EXAMPLE.COM', 'ismail.noor@example.com', 'ISMAIL.NOOR@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEERTniPG3ZvXXmDRIBYAebQ0zG6aVE8L6DQptWZDhVPy3UVoBXmxX8g7ty6M9hjTiw==', '1cead7f0-0fbf-447a-a069-3e56ae31c3a0', 'd8b2088b-b873-4b24-b783-50fb9791a02b', '0610000007', 0, 0, 1, 0, 'Ismail Noor', '2026-06-13 11:16:10'),
  ('636c70eb-7709-4a9a-a807-54c0d89bb3d0', 'yusuf.ahmed@example.com', 'YUSUF.AHMED@EXAMPLE.COM', 'yusuf.ahmed@example.com', 'YUSUF.AHMED@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEGOWk8AUgABAA8jY2SZpBqQN53q6hP8eC9HX44T7hgmK92SWJp3dA0PGbV4qrn931Q==', '8bf7f45a-6434-4052-8ac3-0904b258950f', 'e2295d38-7414-4dea-9d46-3654d245eb13', '0610000008', 0, 0, 1, 0, 'Yusuf Ahmed', '2026-06-10 11:16:10'),
  ('027966cf-196e-4bed-b2b8-60c13897d620', 'bashir.abdi@example.com', 'BASHIR.ABDI@EXAMPLE.COM', 'bashir.abdi@example.com', 'BASHIR.ABDI@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEKDLrXxLFtqJ8b1aW1Z4O1k0WrZjU3v0Fyw5p10LUhJoxEl0IsggjslWw25XW0vlNw==', '3d253fa2-8b0e-4eca-b5a0-b8a72d14e085', '5407c68b-5a61-4623-b779-809ca20301f0', '0610000009', 0, 0, 1, 0, 'Bashir Abdi', '2026-06-07 11:16:10'),
  ('d98493a4-2742-40a3-99f8-9b60adf76fdc', 'mohamed.hassan@example.com', 'MOHAMED.HASSAN@EXAMPLE.COM', 'mohamed.hassan@example.com', 'MOHAMED.HASSAN@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEAKMFo7ytDKxxbZXlcIh/NboyfHpEHgvLGzfMDcopqcPGg8PgIlvtfGh8HrkoZruEA==', 'd91ac8bf-86e6-41e7-b1ca-9f97ea726058', '2fabeda1-00b2-4f75-b466-a0cb1b5b220e', '0610000010', 0, 0, 1, 0, 'Mohamed Hassan', '2026-06-04 11:16:10'),
  ('f6f63379-0200-4d79-876d-078fbe3218bc', 'amina.mohamed@example.com', 'AMINA.MOHAMED@EXAMPLE.COM', 'amina.mohamed@example.com', 'AMINA.MOHAMED@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEMsbG2OiWU82xwq/D+CDp1iwLwhP7loemo6E7JiB2gg3fAQqC5n0jdwsfoUGf21qVQ==', 'be10be64-97f1-4376-87be-04d5bdf38273', 'e754d62a-065d-442e-a808-36c910e942fa', '0610000011', 0, 0, 1, 0, 'Amina Mohamed', '2026-06-01 11:16:10'),
  ('2ccbea5d-7569-44c2-81ad-dacf283a37a1', 'hodan.ahmed@example.com', 'HODAN.AHMED@EXAMPLE.COM', 'hodan.ahmed@example.com', 'HODAN.AHMED@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEJASDO5ctgjVPxeHSEHIkFZ7SDVh9hqCzlteMpSgFHo30sVXzRXTZmzzqLNAIsa3zA==', '614bf25a-dd14-4301-ad33-ae9d2cb40b52', 'a6c9dd15-a1e3-44c5-95ff-032d5f126476', '0610000012', 0, 0, 1, 0, 'Hodan Ahmed', '2026-05-29 11:16:10'),
  ('fef7107f-5df9-4a95-8d96-1a5bd19f581e', 'fadumo.ali@example.com', 'FADUMO.ALI@EXAMPLE.COM', 'fadumo.ali@example.com', 'FADUMO.ALI@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEODzTGRXn6UDEfYAMOj1eiMJEZyON7DQNVokjIXDFNUIMh+pVaT66XxYV95BU8LNjQ==', '9af8b7ca-b3ef-4765-8ff7-39a6c824c7bb', 'df58c546-ac22-48f7-ac40-aa6eaf4440c8', '0610000013', 0, 0, 1, 0, 'Fadumo Ali', '2026-05-26 11:16:10'),
  ('a0024a9c-09e6-47f1-b6e8-d0881a6cb6e7', 'sahra.hassan@example.com', 'SAHRA.HASSAN@EXAMPLE.COM', 'sahra.hassan@example.com', 'SAHRA.HASSAN@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEIqF+nDHxtAdrap3Q6EDxYRdchUdfgURuK4c7JfuO0wTABFLM8D8FuxmpMdZH1PW0g==', '05b68fa5-cddb-4d7f-b84e-16b880a10d7b', '200c9312-3df8-4ba1-be29-68ef67a11918', '0610000014', 0, 0, 1, 0, 'Sahra Hassan', '2026-05-23 11:16:10'),
  ('3be8dad6-af6b-4002-8dd5-3f7192416481', 'hawa.abdi@example.com', 'HAWA.ABDI@EXAMPLE.COM', 'hawa.abdi@example.com', 'HAWA.ABDI@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEAWvLprPeAYMc1vH3UNhuhC7hGAJ3ZowGa58YsDxg3WuS3ddeu0XPBqVbQtvQwu3iw==', '3b655a01-940a-4bf3-8fd4-863639ad9e07', '000caad0-c68a-4ce9-905c-e679b65a78e3', '0610000015', 0, 0, 1, 0, 'Hawa Abdi', '2026-05-20 11:16:10'),
  ('c3ca99a6-87b6-4c79-83e3-203fe158d7b0', 'nasteho.mohamed@example.com', 'NASTEHO.MOHAMED@EXAMPLE.COM', 'nasteho.mohamed@example.com', 'NASTEHO.MOHAMED@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEP5EvcyzDTT6xBwzOvz1ITMgMWmaNHxqXFOrYU7LmKjVurQRVVnWiFZx7+MUW7jRcg==', '580c9bd7-0897-49e7-b998-ebffd06960d5', '500f8362-9f5b-4f98-832d-b2937c4ee303', '0610000016', 0, 0, 1, 0, 'Nasteho Mohamed', '2026-05-17 11:16:10'),
  ('3e51ab2f-11d3-4ed5-983e-a3086dc59d65', 'ifrah.osman@example.com', 'IFRAH.OSMAN@EXAMPLE.COM', 'ifrah.osman@example.com', 'IFRAH.OSMAN@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEPAcwe/AqUKlYUj5o3/vyDkXAYr9+rqjnZo557dgtbuxyPPY0/8ppCMw2TE01cesAg==', '71590232-80a4-43ac-b550-9d1c01410f5f', 'abbab121-7589-4fd1-a237-ffc43d242cc7', '0610000017', 0, 0, 1, 0, 'Ifrah Osman', '2026-05-14 11:16:10'),
  ('5b5d15cc-bfa7-40a8-9db1-318dee76cc03', 'maryan.noor@example.com', 'MARYAN.NOOR@EXAMPLE.COM', 'maryan.noor@example.com', 'MARYAN.NOOR@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAENZJAB7BF7JvITiYBF2MpF6Pj8xKTVWuYiWkYIQID0aH/YkEHVx+YmkRAQfrzBq+dA==', '36e77bf3-31e5-469e-97d9-aae5c1bd2bd1', '875a90ef-a521-4151-a5da-919a5de21d1e', '0610000018', 0, 0, 1, 0, 'Maryan Noor', '2026-05-11 11:16:11'),
  ('e6a3b7dc-bdec-408b-a84e-22bc2bbe9d37', 'khadra.yusuf@example.com', 'KHADRA.YUSUF@EXAMPLE.COM', 'khadra.yusuf@example.com', 'KHADRA.YUSUF@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEBm7zP1po67zpWzK6eXaBXy7GKz3PmZbRnIgLoF7kdWcWpEHXL5jaRgTP/12gzTeFg==', '95aa25c3-e6f0-4b86-b3fb-246d92193ef7', 'ef2d99ff-5f13-4572-8b68-8a626e7f4937', '0610000019', 0, 0, 1, 0, 'Khadra Yusuf', '2026-05-08 11:16:11'),
  ('bc5feb90-85c1-4483-ae74-4694cb41b6bc', 'ubax.ibrahim@example.com', 'UBAX.IBRAHIM@EXAMPLE.COM', 'ubax.ibrahim@example.com', 'UBAX.IBRAHIM@EXAMPLE.COM', 1, 'AQAAAAEAAYagAAAAEFI7kb00wUNoI2nz473c1fIEd3bapTQ1wy5EcZXflqI9IlZO/2rfLs2qQoTtp0JJjQ==', 'e8a30c9e-a695-4ff5-a0f9-69eeb81d5463', 'c5c882b7-a0d7-4b80-b897-dd85083bf1dd', '0610000020', 0, 0, 1, 0, 'Ubax Ibrahim', '2026-05-05 11:16:11');

-- ---------- Assign every seeded user the 'User' role ----------
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT u.Id, r.Id
FROM AspNetUsers u
JOIN AspNetRoles r ON r.Name = 'User'
WHERE u.Email LIKE '%@example.com';

-- ---------- One booking per seeded user (on existing rooms) ----------
INSERT INTO Bookings
  (UserId, HotelId, RoomId, CheckInDate, CheckOutDate, TotalPrice, PaymentMethod, Status, CreatedAt)
SELECT u.Id, r.HotelId, r.Id,
       DATE_ADD(CURDATE(), INTERVAL (u.rn * 4) DAY),
       DATE_ADD(CURDATE(), INTERVAL (u.rn * 4 + 2) DAY),
       r.PricePerNight * 2,
       CASE WHEN u.rn % 2 = 0 THEN 'EVC' ELSE 'VISA' END,
       CASE WHEN u.rn % 3 = 0 THEN 'Confirmed'
            WHEN u.rn % 3 = 1 THEN 'Pending'
            ELSE 'Cancelled' END,
       NOW()
FROM (
  SELECT Id, ROW_NUMBER() OVER (ORDER BY CreatedAt, Id) AS rn
  FROM AspNetUsers WHERE Email LIKE '%@example.com'
) u
JOIN (
  SELECT Id, HotelId, PricePerNight,
         ROW_NUMBER() OVER (ORDER BY Id) AS rrn,
         COUNT(*) OVER () AS cnt
  FROM Rooms
) r ON r.rrn = ((u.rn - 1) % r.cnt) + 1;

-- Verify
SELECT u.FullName, u.Email, b.Status, b.PaymentMethod, b.TotalPrice
FROM AspNetUsers u LEFT JOIN Bookings b ON b.UserId = u.Id
WHERE u.Email LIKE '%@example.com' ORDER BY u.CreatedAt;
