# OctoFit Tracker API Configuration

## ✅ Configuration Complete

### Port Configuration
- **Port**: 8000
- **Location**: [index.ts](src/index.ts#L15)
- **Environment Variable**: `PORT` (defaults to 8000)

### Codespaces & Localhost Support

The API automatically detects the environment and builds the appropriate base URL:

```typescript
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;
```

**In Codespaces:**
- URL: `https://$CODESPACE_NAME-8000.app.github.dev`
- Automatically constructed when `CODESPACE_NAME` environment variable is present

**On Localhost:**
- URL: `http://localhost:8000`
- Used when `CODESPACE_NAME` is not set

## API Endpoints

### Core Endpoints
- `GET /api/health` - Health check with environment info
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/activities` - List all activities
- `POST /api/activities` - Log new activity

### Full Endpoint List
See [API.md](API.md) for complete documentation.

## Verification Commands

### Using curl (Local)

```bash
# Health check
curl http://localhost:8000/api/health

# Get all users
curl http://localhost:8000/api/users

# Get all activities
curl http://localhost:8000/api/activities

# Create a new user
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fitnessLevel": "beginner"
  }'

# Log an activity
curl -X POST http://localhost:8000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "activityType": "running",
    "duration": 30,
    "calories": 250,
    "points": 30
  }'
```

### Using curl (Codespaces)

Replace `$CODESPACE_NAME` with your actual Codespace name:

```bash
# Health check
curl https://$CODESPACE_NAME-8000.app.github.dev/api/health

# Get all users
curl https://$CODESPACE_NAME-8000.app.github.dev/api/users

# Get all activities
curl https://$CODESPACE_NAME-8000.app.github.dev/api/activities
```

### Using PowerShell (Windows)

```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:8000/api/health

# Get all users
Invoke-RestMethod -Uri http://localhost:8000/api/users

# Get all activities
Invoke-RestMethod -Uri http://localhost:8000/api/activities
```

## Starting the Server

### Prerequisites
MongoDB must be running on port 27017:
```bash
# Check if MongoDB is running
ps aux | grep mongod  # Linux/Mac
Get-Process | Where-Object {$_.ProcessName -like "*mongod*"}  # Windows
```

### Start Development Server
```bash
npm run dev
```

### Expected Output
```
Connected to MongoDB (octofit_db)
Server is running on http://localhost:8000
API endpoints available at http://localhost:8000/api
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit_db
```

## Troubleshooting

### MongoDB Connection Error
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Start MongoDB service
- Windows: Start MongoDB service from Services
- Linux: `sudo systemctl start mongod`
- Mac: `brew services start mongodb-community`

### Port Already in Use
```
Error: listen EADDRINUSE :::8000
```

**Solution**: 
1. Find and stop process using port 8000
2. Or change PORT in .env file

### CORS Issues
The API is configured with CORS enabled for all origins. If you need to restrict origins, modify the cors configuration in [index.ts](src/index.ts).

## Health Check Response

The `/api/health` endpoint returns environment information:

```json
{
  "status": "ok",
  "message": "OctoFit Tracker API is running",
  "baseUrl": "http://localhost:8000",
  "timestamp": "2026-06-18T00:00:00.000Z"
}
```

In Codespaces, `baseUrl` will show the Codespaces URL.
