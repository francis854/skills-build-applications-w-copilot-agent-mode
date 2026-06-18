# OctoFit Tracker - Frontend (Presentation Tier)

React 19 + Vite frontend for the OctoFit Tracker multi-tier fitness application.

## Features

- **User Management**: Create and manage user profiles with fitness levels and goals
- **Team Management**: Create teams, assign captains, and track team points
- **Activity Logging**: Log fitness activities with duration, calories, and points
- **Leaderboard**: View rankings for both users and teams across different time periods
- **Workout Library**: Browse workout templates and get personalized suggestions

## Tech Stack

- **React 19.2.6**: UI framework
- **Vite 8.0.12**: Build tool and dev server
- **React Router 7.18.0**: Client-side routing
- **Bootstrap 5.3.8**: CSS framework for styling

## Environment Variables

The frontend uses Vite environment variables to configure the API connection.

### VITE_CODESPACE_NAME

This variable determines how the frontend connects to the backend API:

- **In GitHub Codespaces**: Set to your codespace name (e.g., `my-codespace-name`)
  - API URL: `https://{VITE_CODESPACE_NAME}-8000.app.github.dev/api`
  
- **Local Development**: Leave unset or empty
  - API URL: `http://localhost:8000/api`

### Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **For GitHub Codespaces:**
   - Get your codespace name: `echo $CODESPACE_NAME`
   - Edit `.env.local` and set:
     ```
     VITE_CODESPACE_NAME=your-codespace-name
     ```

3. **For Local Development:**
   - Leave `VITE_CODESPACE_NAME` empty or unset in `.env.local`

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or your Codespaces URL on port 5173).

## Build

```bash
npm run build
```

## API Integration

The frontend uses a centralized API module ([src/api.js](src/api.js)) that:

- Automatically detects Codespaces vs localhost environment
- Handles both array and paginated API responses
- Provides consistent error handling
- Exports organized API functions for all endpoints:
  - `api.users.*`
  - `api.teams.*`
  - `api.activities.*`
  - `api.leaderboard.*`
  - `api.workouts.*`

## Project Structure

```
src/
├── components/        # React components
│   ├── Users.jsx      # User management
│   ├── Teams.jsx      # Team management
│   ├── Activities.jsx # Activity logging
│   ├── Leaderboard.jsx # Rankings and leaderboards
│   └── Workouts.jsx   # Workout library
├── api.js            # API client with Codespaces support
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point with BrowserRouter
└── index.css         # Global styles
```

## Port Configuration

- **Frontend (Vite)**: Port 5173 (public)
- **Backend API**: Port 8000 (public)
- **MongoDB**: Port 27017 (private)

## React + Vite

This template uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) with [Oxc](https://oxc.rs) for fast refresh.
