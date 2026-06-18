# OctoFit Tracker

A modern multi-tier fitness tracking application built with React and Node.js.

## Project Structure

```
octofit-tracker/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── models/   # Mongoose models
│   │   ├── routes/   # Express routes
│   │   ├── index.ts  # Main server file
│   │   └── seed.ts   # Database seed script
│   ├── package.json
│   ├── tsconfig.json
│   └── .env          # Environment variables
└── frontend/         # React 19 + Vite
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Tech Stack

### Presentation Tier (Frontend)
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Navigation
- **Bootstrap** - Styling
- **Port**: 5173

### Logic Tier (Backend)
- **Node.js (LTS)** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **Port**: 8000

### Data Tier
- **MongoDB** - Database (octofit_db)
- **Port**: 27017

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:userId` - Remove member from team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Activities
- `GET /api/activities` - Get all activities (supports filters: userId, activityType, startDate, endDate)
- `GET /api/activities/:id` - Get activity by ID
- `GET /api/activities/stats/:userId` - Get user statistics
- `POST /api/activities` - Log new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Leaderboard
- `GET /api/leaderboard` - Get user leaderboard (params: period=daily/weekly/monthly/alltime, limit)
- `GET /api/leaderboard/teams` - Get team leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user's rank (params: period)

### Workouts
- `GET /api/workouts` - Get all workouts (supports filters: difficulty, activityType)
- `GET /api/workouts/:id` - Get workout by ID
- `GET /api/workouts/suggestions/:userId` - Get personalized workout suggestions
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

## Getting Started

### Prerequisites
- Node.js (LTS version)
- MongoDB installed and running

### Check MongoDB Status

```bash
ps aux | grep mongod
```

If MongoDB is not running, start it according to your system's service manager.

### Backend Setup

```bash
cd octofit-tracker/backend

# Install dependencies (already done)
npm install

# Seed the database with test data
npm run seed

# Run development server
npm run dev
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd octofit-tracker/frontend

# Install dependencies (already done)
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Database Models

### User
- username, email, password
- fitnessLevel (beginner/intermediate/advanced)
- goals (array)
- teamId (reference)

### Team
- name, description
- captain (reference to User)
- members (array of User references)
- totalPoints

### Activity
- userId (reference)
- activityType (running/cycling/swimming/walking/gym/yoga/sports/other)
- duration, distance, calories, points
- notes, date

### Workout
- name, description
- activityType, duration, difficulty
- caloriesEstimate, pointsEstimate
- instructions (array), equipment (array)

### Leaderboard
- Dynamically calculated from Activity aggregations
- Supports daily, weekly, monthly, and all-time periods

## Seed Data

The seed script creates:
- 5 sample users with different fitness levels
- 2 teams with member assignments
- 35+ activities across the past week
- 6 workout templates

Run `npm run seed` in the backend directory to populate the database.

## Features

- ✅ User authentication and profiles
- ✅ Activity logging and tracking
- ✅ Team creation and management
- ✅ Competitive leaderboard (individual and team)
- ✅ Personalized workout suggestions
- ✅ Activity statistics and analytics
- ✅ Environment-aware URLs for Codespaces

## Development Notes

- Never change directories in commands - always reference target paths directly
- Frontend port: 5173 (public)
- Backend port: 8000 (public)
- MongoDB port: 27017 (private)
- Database name: octofit_db

## Testing the API

Example curl commands:

```bash
# Health check
curl http://localhost:8000/api/health

# Get all users
curl http://localhost:8000/api/users

# Get leaderboard
curl http://localhost:8000/api/leaderboard?period=weekly&limit=10

# Get workout suggestions for a user
curl http://localhost:8000/api/workouts/suggestions/{userId}
```
