# Sample Schedule Files Created

This document lists all the sample JSON schedule files that have been created. Each team/club/country/car has its own dedicated JSON file.

## File Naming Convention
All files follow the pattern: `{Team_Name}_Schedule.json`
- Spaces in team names are replaced with underscores
- Example: "Real Madrid" → `Real_Madrid_Schedule.json`

## Directory Structure

```
Schedules/
├── Football/
│   ├── Club/
│   │   ├── Real_Madrid_Schedule.json
│   │   ├── Barcelona_Schedule.json
│   │   ├── Manchester_United_Schedule.json
│   │   ├── Liverpool_Schedule.json
│   │   ├── Manchester_City_Schedule.json
│   │   ├── Chelsea_Schedule.json
│   │   ├── Arsenal_Schedule.json
│   │   ├── Bayern_Munich_Schedule.json
│   │   ├── Paris_Saint-Germain_Schedule.json
│   │   ├── Juventus_Schedule.json
│   │   ├── AC_Milan_Schedule.json
│   │   ├── Inter_Milan_Schedule.json
│   │   ├── Atletico_Madrid_Schedule.json
│   │   ├── Borussia_Dortmund_Schedule.json
│   │   └── Tottenham_Schedule.json
│   │
│   └── International/
│       ├── Brazil_Schedule.json
│       ├── Argentina_Schedule.json
│       ├── France_Schedule.json
│       ├── Germany_Schedule.json
│       ├── Spain_Schedule.json
│       ├── England_Schedule.json
│       ├── Italy_Schedule.json
│       ├── Portugal_Schedule.json
│       ├── Netherlands_Schedule.json
│       ├── Belgium_Schedule.json
│       ├── Croatia_Schedule.json
│       ├── Uruguay_Schedule.json
│       ├── Mexico_Schedule.json
│       ├── Japan_Schedule.json
│       └── South_Korea_Schedule.json
│
├── Cricket/
│   ├── International/
│   │   ├── India_Schedule.json (will be created)
│   │   ├── Australia_Schedule.json
│   │   ├── England_Schedule.json
│   │   ├── Pakistan_Schedule.json
│   │   ├── South_Africa_Schedule.json
│   │   ├── New_Zealand_Schedule.json
│   │   ├── West_Indies_Schedule.json
│   │   ├── Sri_Lanka_Schedule.json
│   │   ├── Bangladesh_Schedule.json
│   │   ├── Afghanistan_Schedule.json
│   │   ├── Ireland_Schedule.json
│   │   └── Zimbabwe_Schedule.json
│   │
│   └── IPL/
│       ├── Mumbai_Indians_Schedule.json (will be created)
│       ├── Chennai_Super_Kings_Schedule.json
│       ├── Royal_Challengers_Bangalore_Schedule.json
│       ├── Kolkata_Knight_Riders_Schedule.json
│       ├── Delhi_Capitals_Schedule.json
│       ├── Sunrisers_Hyderabad_Schedule.json
│       ├── Rajasthan_Royals_Schedule.json
│       ├── Punjab_Kings_Schedule.json
│       ├── Gujarat_Titans_Schedule.json
│       └── Lucknow_Super_Giants_Schedule.json
│
└── F1/
    └── Teams/
        ├── Ferrari_Schedule.json
        ├── Mercedes_Schedule.json
        ├── Red_Bull_Schedule.json
        ├── McLaren_Schedule.json
        ├── Alpine_Schedule.json
        ├── Aston_Martin_Schedule.json
        ├── Williams_Schedule.json
        ├── Alfa_Romeo_Schedule.json
        ├── Haas_Schedule.json
        └── AlphaTauri_Schedule.json
```

## JSON File Format

### Football (Club & International)
```json
[
    {
        "date": "2026-02-15",
        "time": "15:00",
        "team(home)": "Team Name",
        "opponent(away)": "Opponent Name",
        "location": "Stadium Name, City",
        "competition": "League/Tournament Name",
        "matchday": "Matchday Info"
    }
]
```

### Cricket (International & IPL)
```json
[
    {
        "date": "2026-02-10",
        "time": "09:30",
        "team(home)": "Team Name",
        "opponent(away)": "Opponent Name",
        "location": "Ground Name",
        "series": "Series Name",
        "format": "Test/ODI/T20"
    }
]
```

### F1
```json
[
    {
        "date": "2026-03-15",
        "time": "14:00",
        "team(home)": "Team Name",
        "opponent(away)": "All Teams",
        "location": "Circuit Name",
        "competition": "Grand Prix Name",
        "session": "Race/Qualifying/Practice"
    }
]
```

## How to Update

To add real schedule data:
1. Navigate to the appropriate file (e.g., `Schedules/Football/Club/Real_Madrid_Schedule.json`)
2. Replace the sample data with actual match information
3. Maintain the same JSON structure
4. Ensure dates are in `YYYY-MM-DD` format
5. Ensure times are in `HH:MM` format (24-hour)

## Backend Integration

The backend (`backend/main.py`) automatically:
1. Converts team names to filenames (spaces → underscores)
2. Looks for `{Team_Name}_Schedule.json` in the appropriate category folder
3. Returns the schedule data for the frontend to display

**Example**: When a user selects "Real Madrid" (Football → Club):
- Backend looks for: `Schedules/Football/Club/Real_Madrid_Schedule.json`
- Loads and returns the match data
- Frontend displays the schedule with reminder options
