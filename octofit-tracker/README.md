# OctoFit Tracker

A modern multi-tier fitness tracking application built with React and Node.js.

## Project Structure

```
octofit-tracker/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   └── index.ts  # Main server file
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
- **MongoDB** - Database
- **Port**: 27017

## Getting Started

### Prerequisites
- Node.js (LTS version)
- MongoDB installed and running

### Backend Setup

```bash
# Start MongoDB (if not already running)
# Check with: ps aux | grep mongod

# Install dependencies (already done)
cd octofit-tracker/backend

# Run development server
npm run dev
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd octofit-tracker/frontend

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features to Implement

- User authentication and profiles
- Activity logging and tracking
- Team creation and management
- Competitive leaderboard
- Personalized workout suggestions

## Development Notes

- Never change directories in commands - always reference target paths directly
- Frontend port: 5173 (public)
- Backend port: 8000 (public)
- MongoDB port: 27017 (private)
