import json
import os
from datetime import datetime, timedelta

calendar = [
    {"date": "2026-03-08", "location": "Albert Park Circuit, Melbourne", "competition": "Australian Grand Prix"},
    {"date": "2026-03-15", "location": "Shanghai International Circuit", "competition": "Chinese Grand Prix"},
    {"date": "2026-03-29", "location": "Suzuka International Racing Course", "competition": "Japanese Grand Prix"},
    {"date": "2026-04-12", "location": "Bahrain International Circuit", "competition": "Bahrain Grand Prix"},
    {"date": "2026-04-19", "location": "Jeddah Corniche Circuit", "competition": "Saudi Arabian Grand Prix"},
    {"date": "2026-05-03", "location": "Miami International Autodrome", "competition": "Miami Grand Prix"},
    {"date": "2026-05-24", "location": "Circuit Gilles Villeneuve, Montreal", "competition": "Canadian Grand Prix"},
    {"date": "2026-06-07", "location": "Circuit de Monaco", "competition": "Monaco Grand Prix"},
    {"date": "2026-06-14", "location": "Circuit de Barcelona-Catalunya", "competition": "Spanish Grand Prix"},
    {"date": "2026-06-28", "location": "Red Bull Ring, Spielberg", "competition": "Austrian Grand Prix"},
    {"date": "2026-07-05", "location": "Silverstone Circuit", "competition": "British Grand Prix"},
    {"date": "2026-07-19", "location": "Circuit de Spa-Francorchamps", "competition": "Belgian Grand Prix"},
    {"date": "2026-07-26", "location": "Hungaroring, Budapest", "competition": "Hungarian Grand Prix"},
    {"date": "2026-08-23", "location": "Circuit Zandvoort", "competition": "Dutch Grand Prix"},
    {"date": "2026-09-06", "location": "Autodromo Nazionale Monza", "competition": "Italian Grand Prix"},
    {"date": "2026-09-13", "location": "Madrid Street Circuit", "competition": "Spanish Grand Prix (Madrid)"},
    {"date": "2026-09-27", "location": "Baku City Circuit", "competition": "Azerbaijan Grand Prix"},
    {"date": "2026-10-11", "location": "Marina Bay Street Circuit", "competition": "Singapore Grand Prix"},
    {"date": "2026-10-25", "location": "Circuit of the Americas, Austin", "competition": "United States Grand Prix"},
    {"date": "2026-11-01", "location": "Autodromo Hermanos Rodriguez", "competition": "Mexican Grand Prix"},
    {"date": "2026-11-08", "location": "Autodromo Jose Carlos Pace, Interlagos", "competition": "Brazilian Grand Prix"},
    {"date": "2026-11-22", "location": "Las Vegas Strip Circuit", "competition": "Las Vegas Grand Prix"},
    {"date": "2026-11-29", "location": "Lusail International Circuit", "competition": "Qatar Grand Prix"},
    {"date": "2026-12-06", "location": "Yas Marina Circuit", "competition": "Abu Dhabi Grand Prix"}
]

schedule = []
for race in calendar:
    sunday_date = datetime.strptime(race["date"], "%Y-%m-%d")
    schedule.append({
        "date": (sunday_date - timedelta(days=2)).strftime("%Y-%m-%d"),
        "time": "14:00",
        "team(home)": "All Teams",
        "opponent(away)": "All Teams",
        "location": race["location"],
        "competition": race["competition"],
        "session": "Free Practice 1"
    })
    schedule.append({
        "date": (sunday_date - timedelta(days=1)).strftime("%Y-%m-%d"),
        "time": "18:00",
        "team(home)": "All Teams",
        "opponent(away)": "All Teams",
        "location": race["location"],
        "competition": race["competition"],
        "session": "Qualifying"
    })
    schedule.append({
        "date": sunday_date.strftime("%Y-%m-%d"),
        "time": "15:00",
        "team(home)": "All Teams",
        "opponent(away)": "All Teams",
        "location": race["location"],
        "competition": race["competition"],
        "session": "Race"
    })

output_path = "/Users/joeyy/Desktop/Project_1/Schedules/F1/F1_Schedule.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w") as f:
    json.dump(schedule, f, indent=4)
print(f"Generated {output_path}")
