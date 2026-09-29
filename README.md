# Store Rating Platform

A full-stack web application that allows users to submit ratings (1–5) for stores registered on the platform. Features role-based access control with three user types: System Administrator, Normal User, and Store Owner.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Frontend | React.js (Vite) |
| Auth | JWT (JSON Web Tokens) |
| Validation | Zod |

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** (v9 or higher)

## Project Structure

```
pragmatic-assignments/
├── backend/                 # Express.js API server
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Initial admin seeder
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, authorization, validation
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # JWT helpers
│   │   ├── validators/      # Zod validation schemas
│   │   └── app.js           # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/                # React.js SPA
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context provider
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Root component with routing
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Frontend environment variables
│   └── package.json
│
└── README.md
```

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Update .env with your PostgreSQL credentials
# DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/store_rating_db"
# JWT_SECRET="store-rating-jwt-secret-key-2024"
# PORT=5000

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database with initial admin account
npm run seed

# Start the development server
npm run dev
```

The backend will start on **http://localhost:5000**.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173**.

## Default Admin Credentials

After running the seed script, the following admin account is available:

| Field | Value |
|-------|-------|
| **Email** | `admin@ratestore.com` |
| **Password** | `Admin@1234` |

> ⚠️ **Change these credentials in production!**

## User Roles

### System Administrator
- View dashboard with stats (total users, stores, ratings)
- Add new users (any role) and stores
- View and filter user/store listings
- View user details (with store rating for Store Owners)

### Normal User
- Sign up and log in
- View and search stores
- Submit and modify ratings (1–5 stars)
- Change password

### Store Owner
- View dashboard with average rating and list of raters
- Change password

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register (Normal User only) |
| POST | `/api/auth/login` | Login (returns JWT) |
| PUT | `/api/auth/password` | Change password |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| POST | `/api/admin/users` | Add user |
| GET | `/api/admin/users` | List users (filterable/sortable) |
| GET | `/api/admin/users/:id` | User details |
| POST | `/api/admin/stores` | Add store |
| GET | `/api/admin/stores` | List stores (filterable/sortable) |

### Normal User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | List stores with ratings |
| POST | `/api/stores/:id/ratings` | Submit rating |
| PUT | `/api/stores/:id/ratings` | Modify rating |

### Store Owner
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owner/dashboard` | Owner dashboard |

## Form Validations

| Field | Rules |
|-------|-------|
| Name | Min 2 characters, Max 60 characters |
| Email | Valid email format |
| Password | 8–16 characters, at least 1 uppercase letter, at least 1 special character |
| Address | Max 400 characters |
| Rating | Integer between 1 and 5 |

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/store_rating_db"
JWT_SECRET="store-rating-jwt-secret-key-2024"
PORT=5000
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```
