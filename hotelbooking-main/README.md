# 🏨 Sahal Stay — Hotel Booking System

<p align="center">
  <strong>A modern full-stack platform for discovering rooms, managing reservations, and administering hotel operations.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/ASP.NET_Core-8-512BD4?logo=dotnet&logoColor=white" alt="ASP.NET Core">
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens" alt="JWT">
  
</p>

<p align="center">
  <img src="docs/images/sahal-stay-homepage.webp" alt="Sahal Stay hotel booking homepage" width="100%">
</p>

## 📖 About

Sahal Stay is a full-stack hotel booking application built with a **.NET 8 Web API**, **React**, and **MySQL**. Guests can find rooms and manage reservations, while administrators manage rooms, bookings, users, and reports through a dedicated dashboard.

## ✨ Features

### Guest

- Register and sign in securely
- Search available rooms by stay dates and guest capacity
- View room details and prices
- Book rooms with automatic total-price calculation
- View personal booking history
- Cancel eligible pending bookings

### Administrator

- View dashboard statistics
- Add, update, and delete rooms
- Approve or reject bookings
- View and manage registered users
- Review booking 

## 🧰 Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router DOM, Axios |
| Backend | .NET 8, ASP.NET Core Web API |
| Database | MySQL 8 |
| Data access | Entity Framework Core, Pomelo MySQL |
| Authentication | ASP.NET Core Identity, JWT |
| API documentation | Swagger / OpenAPI |
| Mapping | AutoMapper |

## 🏗️ Architecture

```text
React + Vite Client
        │ HTTP / JSON
        ▼
ASP.NET Core Web API
        ├── Identity + JWT
        ├── Business Logic
        └── Entity Framework Core
                    │
                    ▼
                  MySQL
```

## 📁 Project Structure

```text
hotelbooking/
├── HotelBookingAPI/
│   └── HotelBookingAPI/
│       ├── Controllers/      # API endpoints
│       ├── Data/             # EF Core DbContext
│       ├── Migrations/       # Database migrations
│       ├── Models/           # Entity models
│       └── Program.cs        # Application configuration
└── hotel-client/
    ├── src/                  # React source files
    └── package.json
```

## ✅ Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) — LTS recommended
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) — 8.0 or later
- [Git](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/aminanoor-ship-it/hotelbooking.git
cd hotelbooking
```

### 2. Restore backend packages

```bash
cd HotelBookingAPI/HotelBookingAPI
dotnet restore
```

### 3. Install frontend packages

```bash
cd ../../hotel-client
npm install
```

## ⚙️ Configuration

Use ASP.NET Core User Secrets for sensitive local configuration. **Never commit passwords, connection strings, or JWT keys.**

From `HotelBookingAPI/HotelBookingAPI`:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=hotelbooking;User=root;Password=YOUR_DB_PASSWORD;"
dotnet user-secrets set "Jwt:Key" "REPLACE_WITH_A_SECURE_KEY_AT_LEAST_32_CHARACTERS"
dotnet user-secrets set "Jwt:Issuer" "HotelBookingAPI"
dotnet user-secrets set "Jwt:Audience" "HotelClient"
```

## 🗄️ Database Setup

Make sure MySQL is running, then apply the migrations:

```bash
cd HotelBookingAPI/HotelBookingAPI
dotnet ef database update
```

If necessary, install the EF CLI first:

```bash
dotnet tool install --global dotnet-ef
```

## ▶️ Run the Application

### Backend

```bash
cd HotelBookingAPI/HotelBookingAPI
dotnet run
```

Check the terminal for the exact address. Swagger is normally available at:

```text
https://localhost:7001/swagger
```

### Frontend

Open another terminal:

```bash
cd hotel-client
npm run dev
```

Open `http://localhost:5173`.

## 🔐 Default Development Administrator

| Field | Value |
|---|---|
| Email | `admin@hotel.com` |
| Password | `Admin123!` |
| Role | `Admin` |

> Change or remove these development credentials before deployment.

## 🛡️ Security

- Store real secrets in User Secrets or environment variables.
- ASP.NET Core Identity handles password management.
- JWT and role authorization protect restricted API endpoints.
- Use HTTPS and secure cookie settings in production.
- Never commit `bin/`, `obj/`, `dist/`, `node_modules/`, or `.vs/`.

## 🧪 Useful Commands

| Command | Purpose |
|---|---|
| `dotnet build` | Build the API |
| `dotnet run` | Run the API |
| `dotnet ef database update` | Apply migrations |
| `npm run dev` | Start the React client |
| `npm run build` | Build the frontend |
| `npm run lint` | Run ESLint |

## 🗺️ Roadmap

- [ ] Add polished application screenshots
- [ ] Add the database ERD
- [ ] Add automated tests
- [ ] Add continuous integration
- [ ] Deploy a live demo

## 🤝 Contributing

Suggestions and contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a change.

## 👩‍💻 Author

**Amina Noor Abdi** — [@aminanoor-ship-it](https://github.com/aminanoor-ship-it)
