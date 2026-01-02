# FastAPI Backend

## Setup

1. Create and activate virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:

**Option 1: Using the startup script (recommended)**
```bash
./start.sh
```

**Option 2: Direct Python**
```bash
python3 main.py
```

**Option 3: Using uvicorn directly**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**To stop the server:**
```bash
./stop.sh
```

Or manually:
```bash
lsof -ti:8000 | xargs kill -9
```

The API will be available at `http://localhost:8000`

**Note:** The FastAPI server also serves the frontend static files, so you can access the application at `http://localhost:8000` once the server is running. No separate frontend server is needed!

## API Endpoints

### Health Check
- `GET /` - API info
- `GET /health` - Health check

### Schedules
- `GET /api/schedules/{sport}/{category}/{team}` - Get schedule for a team

### Selections
- `POST /api/selections` - Save user selections
- `GET /api/selections` - Get all user selections
- `GET /api/selections/{sport}` - Get selections for a sport

### Matches
- `POST /api/matches` - Save a match
- `GET /api/matches` - Get all matches for user
- `GET /api/matches/{match_id}` - Get specific match
- `PUT /api/matches/{match_id}` - Update a match
- `DELETE /api/matches/{match_id}` - Delete a match

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Notes

- Currently uses in-memory storage (replace with database in production)
- CORS is enabled for all origins (restrict in production)
- Schedule files are read from the `Schedules/` directory


