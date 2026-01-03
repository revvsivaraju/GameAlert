from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from pathlib import Path
from datetime import datetime, timedelta

app = FastAPI(title="Sports Selection API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class SelectionRequest(BaseModel):
    sport: str
    category: Optional[str] = None
    selections: List[str]

class MatchRequest(BaseModel):
    sport: str
    category: Optional[str] = None
    team1: str
    team2: str
    date: str
    time: str
    venue: str
    league: str
    status: str = "upcoming"
    notificationEnabled: bool = False

class MatchUpdate(BaseModel):
    sport: Optional[str] = None
    category: Optional[str] = None
    team1: Optional[str] = None
    team2: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    venue: Optional[str] = None
    league: Optional[str] = None
    status: Optional[str] = None
    notificationEnabled: Optional[bool] = None

# In-memory storage (fallback when DynamoDB is not configured)
selections_db = []
matches_db = []

# DynamoDB configuration - set to True when AWS is configured
USE_DYNAMODB = False

# Try to import DynamoDB manager
try:
    from dynamodb_manager import db as dynamodb
    from aws_config import AWS_CONFIG
    # Only enable if credentials are configured (not empty)
    if AWS_CONFIG['access_key_id'] and AWS_CONFIG['secret_access_key']:
        USE_DYNAMODB = True
        print("✅ DynamoDB enabled")
    else:
        print("⚠️ AWS credentials not set, using in-memory storage")
        print("   Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables")
except ImportError as e:
    print(f"⚠️ DynamoDB module not available: {e}")
except Exception as e:
    print(f"⚠️ Error loading DynamoDB: {e}")

# Helper function to get schedule file path (JSON only)
def get_schedule_file_path(sport: str, category: str, team: str) -> Optional[Path]:
    """Get the path to schedule JSON file"""
    # Get project root (parent of backend directory)
    # __file__ is backend/main.py, so parent.parent gets project root
    backend_dir = Path(__file__).parent.resolve()
    project_root = backend_dir.parent.resolve()
    
    sport_folder = sport.capitalize()
    category_folder = category.capitalize() if category else ""
    
    # Debug logging
    
    # Construct the file path based on naming convention: {Team}_Schedule.json
    # Replace spaces with underscores in team name
    team_filename = team.replace(" ", "_") + "_Schedule.json"
    
    # Build the path to the schedule file
    if category_folder:
        schedule_path = project_root / f"Schedules/{sport_folder}/{category_folder}/{team_filename}"
    else:
        schedule_path = project_root / f"Schedules/{sport_folder}/{team_filename}"
    
    
    # Check if the file exists
    if schedule_path.exists():
        return schedule_path
    
    # NEW: Try common sport schedule file (e.g., F1_Schedule.json)
    common_team_filename = sport_folder + "_Schedule.json"
    if category_folder:
        common_path = project_root / f"Schedules/{sport_folder}/{category_folder}/{common_team_filename}"
    else:
        common_path = project_root / f"Schedules/{sport_folder}/{common_team_filename}"
    
    if common_path.exists():
        return common_path

    # FALLBACK for root directory of sport
    root_common_path = project_root / f"Schedules/{sport_folder}/{common_team_filename}"
    if root_common_path.exists():
        return root_common_path
    
    # FALLBACK: Try looking in subdirectories (old structure)
    if category_folder:
        team_dir = project_root / f"Schedules/{sport_folder}/{category_folder}/{team}"
    else:
        team_dir = project_root / f"Schedules/{sport_folder}/{team}"

    # Try specific file in team directory
    if team_dir.exists():
        json_files = list(team_dir.glob("*.json"))
        if json_files:
            return json_files[0]

    return None

# Helper function to parse JSON schedule
def parse_schedule_json(file_path: Path) -> List[dict]:
    """Parse JSON schedule file"""
    matches = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                matches = data
            else:
                matches = [data]
    except Exception as e:
        print(f"Error parsing JSON: {e}")
    return matches

# Helper function to parse 12-hour time to 24-hour
def parse_12hour_time(time_str: str) -> tuple:
    """Parse 12-hour time format to (hour, minute)"""
    try:
        time_str = time_str.replace(' IST', '').replace(' LOCAL', '').strip()
        is_pm = 'PM' in time_str.upper()
        is_am = 'AM' in time_str.upper()
        time_only = time_str.replace('PM', '').replace('pm', '').replace('AM', '').replace('am', '').strip()
        
        if ':' in time_only:
            hour, minute = map(int, time_only.split(':'))
            if is_pm and hour != 12:
                hour += 12
            elif is_am and hour == 12:
                hour = 0
            return (hour, minute)
    except:
        pass
    return (14, 0)  # Default to 2 PM

# Helper function to calculate match status
def calculate_match_status(match_date: str, match_time: str = None) -> str:
    """Calculate match status based on current date/time"""
    try:
        # Parse date
        if 'TBA' in match_date or not match_date:
            return 'scheduled'
        
        # Handle partial dates like "2026-06-TBA"
        if '-TBA' in match_date or match_date.count('-') < 2:
            return 'scheduled'
        
        # Parse date (format: YYYY-MM-DD)
        date_parts = match_date.split('-')
        if len(date_parts) < 3:
            return 'scheduled'
        
        year = int(date_parts[0])
        month = int(date_parts[1]) if date_parts[1] != 'TBA' else 1
        day = int(date_parts[2]) if date_parts[2] != 'TBA' else 1
        
        match_datetime = datetime(year, month, day)
        
        # If time is provided, try to parse it
        if match_time and match_time != 'TBA':
            hour, minute = parse_12hour_time(match_time)
            match_datetime = match_datetime.replace(hour=hour, minute=minute, second=0, microsecond=0)
        else:
            # Default to 2 PM if no time
            match_datetime = match_datetime.replace(hour=14, minute=0, second=0, microsecond=0)
        
        now = datetime.now()
        
        # Match duration: assume 4 hours for T20/ODI, 5 days for Test
        match_end = match_datetime + timedelta(hours=4)
        
        if now < match_datetime:
            return 'scheduled'
        elif match_datetime <= now <= match_end:
            return 'live'
        else:
            return 'completed'
    except Exception as e:
        print(f"Error calculating match status: {e}")
        return 'scheduled'

# API Routes

@app.get("/api")
async def api_root():
    return {"message": "Sports Selection API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Schedule endpoints
@app.get("/api/schedules/{sport}/{category}/{team}")
async def get_schedule(sport: str, category: str, team: str):
    """Get schedule for a specific team"""
    file_path = get_schedule_file_path(sport, category, team)
    
    if not file_path:
        return JSONResponse(
            status_code=404,
            content={"error": "Schedule file not found"}
        )
    
    try:
        # Parse JSON schedule
        schedule_data = parse_schedule_json(file_path)
        # Add status to each match
        for match in schedule_data:
            match['status'] = calculate_match_status(
                match.get('date', ''),
                match.get('time', '')
            )
        
        return {"success": True, "data": schedule_data, "count": len(schedule_data), "format": "json"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading schedule: {str(e)}")

# Selection endpoints
@app.post("/api/selections")
async def save_selection(selection: SelectionRequest, userId: Optional[str] = Query(None)):
    """Save user selections - updates existing if found, otherwise creates new"""
    from datetime import datetime
    
    selection_data = {
        "sport": selection.sport,
        "category": selection.category,
        "selections": selection.selections
    }
    
    if USE_DYNAMODB:
        result = dynamodb.save_selection(selection_data, userId)
        return {"success": True, "message": "Selections saved successfully", "data": result}
    else:
        # In-memory fallback
        existing_index = None
        for i, existing in enumerate(selections_db):
            if (existing.get("userId") == userId and 
                existing.get("sport") == selection.sport and 
                existing.get("category") == selection.category):
                existing_index = i
                break
        
        selection_data["userId"] = userId
        selection_data["timestamp"] = datetime.now().isoformat()
        
        if existing_index is not None:
            selections_db[existing_index] = selection_data
            return {"success": True, "message": "Selections updated successfully", "data": selection_data}
        else:
            selections_db.append(selection_data)
            return {"success": True, "message": "Selections saved successfully", "data": selection_data}

@app.get("/api/selections")
async def get_selections(userId: Optional[str] = Query(None)):
    """Get user selections"""
    if USE_DYNAMODB:
        user_selections = dynamodb.get_selections(userId)
    else:
        if userId:
            user_selections = [s for s in selections_db if s.get("userId") == userId]
        else:
            user_selections = [s for s in selections_db if not s.get("userId")]
    return {"success": True, "data": user_selections}

@app.get("/api/selections/{sport}")
async def get_selections_by_sport(sport: str, userId: Optional[str] = Query(None)):
    """Get selections for a specific sport"""
    if USE_DYNAMODB:
        filtered = dynamodb.get_selections_by_sport(sport, userId)
    else:
        all_selections = selections_db
        if userId:
            all_selections = [s for s in all_selections if s.get("userId") == userId]
        else:
            all_selections = [s for s in all_selections if not s.get("userId")]
        filtered = [s for s in all_selections if s.get("sport") == sport]
    return {"success": True, "data": filtered}

@app.delete("/api/selections/{sport}/{category}")
async def delete_selection(sport: str, category: str, userId: Optional[str] = Query(None)):
    """Delete a selection"""
    global selections_db
    
    if USE_DYNAMODB:
        success = dynamodb.delete_selection(sport, category, userId)
        if success:
            return {"success": True, "message": "Selection deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Selection not found")
    else:
        initial_length = len(selections_db)
        selections_db = [
            s for s in selections_db 
            if not (s.get("userId") == userId and s.get("sport") == sport and s.get("category") == category)
        ]
        
        if len(selections_db) < initial_length:
            return {"success": True, "message": "Selection deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Selection not found")

# Match endpoints
@app.post("/api/matches")
async def save_match(match: MatchRequest, userId: Optional[str] = Query(None)):
    """Save a match"""
    import uuid
    from datetime import datetime
    
    match_data = {
        "sport": match.sport,
        "category": match.category,
        "team1": match.team1,
        "team2": match.team2,
        "date": match.date,
        "time": match.time,
        "venue": match.venue,
        "league": match.league,
        "status": match.status,
        "notificationEnabled": match.notificationEnabled
    }
    
    if USE_DYNAMODB:
        result = dynamodb.save_match(match_data, userId)
        return {"success": True, "message": "Match saved successfully", "data": result}
    else:
        match_data["id"] = f"match_{uuid.uuid4().hex[:12]}"
        match_data["userId"] = userId
        match_data["saved"] = True
        match_data["createdAt"] = datetime.now().isoformat()
        match_data["updatedAt"] = datetime.now().isoformat()
        matches_db.append(match_data)
        return {"success": True, "message": "Match saved successfully", "data": match_data}

@app.get("/api/matches")
async def get_matches(userId: Optional[str] = Query(None)):
    """Get all matches for a user"""
    if USE_DYNAMODB:
        user_matches = dynamodb.get_matches(userId)
    else:
        if userId:
            user_matches = [m for m in matches_db if m.get("userId") == userId]
        else:
            user_matches = [m for m in matches_db if not m.get("userId")]
    return {"success": True, "data": user_matches}

@app.get("/api/matches/{match_id}")
async def get_match(match_id: str):
    """Get a specific match"""
    if USE_DYNAMODB:
        match = dynamodb.get_match(match_id)
    else:
        match = next((m for m in matches_db if m.get("id") == match_id), None)
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return {"success": True, "data": match}

@app.put("/api/matches/{match_id}")
async def update_match(match_id: str, updates: MatchUpdate):
    """Update a match"""
    from datetime import datetime
    
    update_dict = updates.dict(exclude_unset=True)
    
    if USE_DYNAMODB:
        result = dynamodb.update_match(match_id, update_dict)
        if result:
            return {"success": True, "message": "Match updated successfully", "data": result}
        else:
            raise HTTPException(status_code=404, detail="Match not found")
    else:
        match = next((m for m in matches_db if m.get("id") == match_id), None)
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        
        match.update(update_dict)
        match["updatedAt"] = datetime.now().isoformat()
        return {"success": True, "message": "Match updated successfully", "data": match}

@app.delete("/api/matches/{match_id}")
async def delete_match(match_id: str):
    """Delete a match"""
    global matches_db
    
    if USE_DYNAMODB:
        success = dynamodb.delete_match(match_id)
        if success:
            return {"success": True, "message": "Match deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Match not found")
    else:
        initial_count = len(matches_db)
        matches_db = [m for m in matches_db if m.get("id") != match_id]
        
        if len(matches_db) == initial_count:
            raise HTTPException(status_code=404, detail="Match not found")
        
        return {"success": True, "message": "Match deleted successfully"}

# Mount static files (serve frontend) - must be after API routes
static_path = Path(__file__).parent.parent
if (static_path / "index.html").exists():
    @app.get("/")
    async def serve_index():
        return FileResponse(str(static_path / "index.html"))
    
    @app.get("/{path:path}")
    async def serve_static(path: str):
        # Skip API routes
        if path.startswith("api/") or path == "health":
            raise HTTPException(status_code=404, detail="Not found")
        
        file_path = static_path / path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        # Fallback to index.html for SPA routing
        return FileResponse(str(static_path / "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

