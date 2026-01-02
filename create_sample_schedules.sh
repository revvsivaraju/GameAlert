#!/bin/bash

# Football Clubs
clubs=("Barcelona" "Manchester_United" "Liverpool" "Manchester_City" "Chelsea" "Arsenal" "Bayern_Munich" "Paris_Saint-Germain" "Juventus" "AC_Milan" "Inter_Milan" "Atletico_Madrid" "Borussia_Dortmund" "Tottenham")

for club in "${clubs[@]}"; do
  cat > "Schedules/Football/Club/${club}_Schedule.json" <<JSON
[
    {
        "date": "2026-02-15",
        "time": "15:00",
        "team(home)": "${club//_/ }",
        "opponent(away)": "TBD",
        "location": "Home Stadium",
        "competition": "League",
        "matchday": "Sample Match 1"
    },
    {
        "date": "2026-02-22",
        "time": "18:00",
        "team(home)": "TBD",
        "opponent(away)": "${club//_/ }",
        "location": "Away Stadium",
        "competition": "League",
        "matchday": "Sample Match 2"
    }
]
JSON
done

# Football International
countries=("Brazil" "Argentina" "France" "Germany" "Spain" "England" "Italy" "Portugal" "Netherlands" "Belgium" "Croatia" "Uruguay" "Mexico" "Japan" "South_Korea")

for country in "${countries[@]}"; do
  cat > "Schedules/Football/International/${country}_Schedule.json" <<JSON
[
    {
        "date": "2026-03-20",
        "time": "19:00",
        "team(home)": "${country//_/ }",
        "opponent(away)": "TBD",
        "location": "National Stadium",
        "competition": "Friendly",
        "matchday": "International Friendly"
    },
    {
        "date": "2026-03-25",
        "time": "20:00",
        "team(home)": "TBD",
        "opponent(away)": "${country//_/ }",
        "location": "Away Stadium",
        "competition": "World Cup Qualifier",
        "matchday": "Qualifier Match"
    }
]
JSON
done

# Cricket International
cricket_countries=("Australia" "England" "Pakistan" "South_Africa" "New_Zealand" "West_Indies" "Sri_Lanka" "Bangladesh" "Afghanistan" "Ireland" "Zimbabwe")

for country in "${cricket_countries[@]}"; do
  cat > "Schedules/Cricket/International/${country}_Schedule.json" <<JSON
[
    {
        "date": "2026-02-10",
        "time": "09:30",
        "team(home)": "${country//_/ }",
        "opponent(away)": "TBD",
        "location": "Home Ground",
        "series": "Test Series",
        "format": "Test"
    },
    {
        "date": "2026-02-20",
        "time": "14:00",
        "team(home)": "${country//_/ }",
        "opponent(away)": "TBD",
        "location": "Home Ground",
        "series": "ODI Series",
        "format": "ODI"
    }
]
JSON
done

# IPL Teams
ipl_teams=("Chennai_Super_Kings" "Royal_Challengers_Bangalore" "Kolkata_Knight_Riders" "Delhi_Capitals" "Sunrisers_Hyderabad" "Rajasthan_Royals" "Punjab_Kings" "Gujarat_Titans" "Lucknow_Super_Giants")

for team in "${ipl_teams[@]}"; do
  cat > "Schedules/Cricket/IPL/${team}_Schedule.json" <<JSON
[
    {
        "date": "2026-04-05",
        "time": "19:30",
        "team(home)": "${team//_/ }",
        "opponent(away)": "TBD",
        "location": "Home Stadium",
        "series": "IPL 2026",
        "format": "T20"
    },
    {
        "date": "2026-04-10",
        "time": "15:30",
        "team(home)": "TBD",
        "opponent(away)": "${team//_/ }",
        "location": "Away Stadium",
        "series": "IPL 2026",
        "format": "T20"
    }
]
JSON
done

# F1 Teams
f1_teams=("Mercedes" "Red_Bull" "McLaren" "Alpine" "Aston_Martin" "Williams" "Alfa_Romeo" "Haas" "AlphaTauri")

for team in "${f1_teams[@]}"; do
  cat > "Schedules/F1/Teams/${team}_Schedule.json" <<JSON
[
    {
        "date": "2026-03-15",
        "time": "14:00",
        "team(home)": "${team//_/ }",
        "opponent(away)": "All Teams",
        "location": "Bahrain International Circuit",
        "competition": "Bahrain Grand Prix",
        "session": "Race"
    },
    {
        "date": "2026-03-22",
        "time": "15:00",
        "team(home)": "${team//_/ }",
        "opponent(away)": "All Teams",
        "location": "Jeddah Corniche Circuit",
        "competition": "Saudi Arabian Grand Prix",
        "session": "Race"
    }
]
JSON
done

echo "All sample schedule files created successfully!"
