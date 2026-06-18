# OctoFit Tracker API Documentation

Base URL: `http://localhost:8000/api` (or Codespaces URL)

## Authentication

Currently, the API does not require authentication. User passwords are stored but not yet validated.

## Response Format

All responses are in JSON format.

Success responses include the requested data.
Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Endpoints

### Health Check

#### GET /api/health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "OctoFit Tracker API is running",
  "baseUrl": "http://localhost:8000",
  "timestamp": "2026-06-18T00:00:00.000Z"
}
```

---

## Users

### GET /api/users
Get all users.

**Response:**
```json
[
  {
    "_id": "user_id",
    "username": "octocat",
    "email": "octocat@github.com",
    "fitnessLevel": "intermediate",
    "goals": ["lose weight", "build muscle"],
    "teamId": { "_id": "team_id", "name": "Team Name" },
    "createdAt": "2026-06-18T00:00:00.000Z",
    "updatedAt": "2026-06-18T00:00:00.000Z"
  }
]
```

### GET /api/users/:id
Get a specific user by ID.

### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fitnessLevel": "beginner",
  "goals": ["get active"]
}
```

### PUT /api/users/:id
Update a user.

**Request Body:**
```json
{
  "username": "updatedname",
  "fitnessLevel": "intermediate",
  "goals": ["new goal"]
}
```

### DELETE /api/users/:id
Delete a user.

---

## Teams

### GET /api/teams
Get all teams with populated captain and members.

### GET /api/teams/:id
Get a specific team by ID.

### POST /api/teams
Create a new team.

**Request Body:**
```json
{
  "name": "Fitness Warriors",
  "description": "Team description",
  "captain": "user_id"
}
```

### POST /api/teams/:id/members
Add a member to a team.

**Request Body:**
```json
{
  "userId": "user_id"
}
```

### DELETE /api/teams/:id/members/:userId
Remove a member from a team.

### PUT /api/teams/:id
Update a team.

### DELETE /api/teams/:id
Delete a team.

---

## Activities

### GET /api/activities
Get activities with optional filters.

**Query Parameters:**
- `userId` - Filter by user ID
- `activityType` - Filter by activity type
- `startDate` - Filter activities after this date
- `endDate` - Filter activities before this date

### GET /api/activities/:id
Get a specific activity by ID.

### GET /api/activities/stats/:userId
Get aggregated statistics for a user.

**Response:**
```json
{
  "totalActivities": 15,
  "totalDuration": 450,
  "totalDistance": 75.5,
  "totalCalories": 3500,
  "totalPoints": 450
}
```

### POST /api/activities
Log a new activity.

**Request Body:**
```json
{
  "userId": "user_id",
  "activityType": "running",
  "duration": 30,
  "distance": 5,
  "calories": 250,
  "points": 30,
  "notes": "Morning run",
  "date": "2026-06-18T08:00:00.000Z"
}
```

### PUT /api/activities/:id
Update an activity.

### DELETE /api/activities/:id
Delete an activity.

---

## Leaderboard

### GET /api/leaderboard
Get user leaderboard.

**Query Parameters:**
- `period` - daily, weekly, monthly, or alltime (default: alltime)
- `limit` - Number of results (default: 10)

**Response:**
```json
{
  "period": "weekly",
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_id",
      "username": "octocat",
      "email": "octocat@github.com",
      "team": { "_id": "team_id", "name": "Team Name" },
      "totalPoints": 450,
      "totalActivities": 12,
      "totalDuration": 360,
      "totalCalories": 2800
    }
  ]
}
```

### GET /api/leaderboard/teams
Get team leaderboard.

**Query Parameters:**
- `limit` - Number of results (default: 10)

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "teamId": "team_id",
      "name": "Fitness Warriors",
      "captain": { "username": "octocat", "email": "..." },
      "memberCount": 5,
      "totalPoints": 1250
    }
  ]
}
```

### GET /api/leaderboard/rank/:userId
Get a specific user's rank.

**Query Parameters:**
- `period` - daily, weekly, monthly, or alltime (default: alltime)

**Response:**
```json
{
  "rank": 3,
  "totalPoints": 420,
  "period": "weekly"
}
```

---

## Workouts

### GET /api/workouts
Get all workouts with optional filters.

**Query Parameters:**
- `difficulty` - beginner, intermediate, or advanced
- `activityType` - running, cycling, swimming, etc.

### GET /api/workouts/:id
Get a specific workout by ID.

### GET /api/workouts/suggestions/:userId
Get personalized workout suggestions based on user's fitness level.

**Query Parameters:**
- `limit` - Number of suggestions (default: 5)

**Response:**
```json
{
  "userId": "user_id",
  "fitnessLevel": "intermediate",
  "suggestions": [
    {
      "_id": "workout_id",
      "name": "Interval Cycling",
      "description": "High-intensity interval training",
      "activityType": "cycling",
      "duration": 45,
      "difficulty": "intermediate",
      "caloriesEstimate": 400,
      "pointsEstimate": 50,
      "instructions": ["Step 1", "Step 2"],
      "equipment": ["bicycle", "helmet"]
    }
  ]
}
```

### POST /api/workouts
Create a new workout.

**Request Body:**
```json
{
  "name": "Morning Run",
  "description": "A refreshing morning run",
  "activityType": "running",
  "duration": 30,
  "difficulty": "beginner",
  "caloriesEstimate": 250,
  "pointsEstimate": 30,
  "instructions": ["Warm up", "Run", "Cool down"],
  "equipment": ["running shoes"]
}
```

### PUT /api/workouts/:id
Update a workout.

### DELETE /api/workouts/:id
Delete a workout.

---

## Activity Types

Valid activity types:
- `running`
- `cycling`
- `swimming`
- `walking`
- `gym`
- `yoga`
- `sports`
- `other`

## Fitness Levels

Valid fitness levels:
- `beginner`
- `intermediate`
- `advanced`

## Points Calculation

Points are awarded based on:
- Activity duration
- Activity intensity
- Distance covered (for applicable activities)
- Calories burned

Team points are automatically updated when activities are logged, updated, or deleted.
