// Match Generation and Management System
const Matches = {
    // Generate sample matches for selected teams
    async generateMatches(selections) {
        const matches = [];

        for (const selection of selections) {
            const { sport, category, teams } = selection;

            // Generate matches based on sport and category
            if (sport === 'football') {
                matches.push(...this.generateFootballMatches(teams, category));
            } else if (sport === 'cricket') {
                const cricketMatches = await this.generateCricketMatches(teams, category);
                matches.push(...cricketMatches);
            } else if (sport === 'f1') {
                const f1Matches = await this.generateF1Matches(teams, category);
                matches.push(...f1Matches);
            }
        }

        return matches;
    },

    // Generate football matches
    generateFootballMatches(teams, category) {
        const matches = [];
        const leagues = category === 'club'
            ? ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Champions League']
            : ['World Cup', 'Euro Championship', 'Copa America', 'African Cup of Nations', 'Asian Cup'];

        const venues = [
            'Wembley Stadium', 'Camp Nou', 'Santiago Bernabéu', 'Allianz Arena',
            'San Siro', 'Old Trafford', 'Anfield', 'Stamford Bridge'
        ];

        // Generate 3-5 matches per team
        teams.forEach((team, index) => {
            const matchCount = 3 + Math.floor(Math.random() * 3);

            for (let i = 0; i < matchCount; i++) {
                const daysFromNow = 7 + (i * 7) + Math.floor(Math.random() * 5);
                const matchDate = new Date();
                matchDate.setDate(matchDate.getDate() + daysFromNow);

                // Select opponent (different team or generic opponent)
                let opponent;
                if (teams.length > 1 && Math.random() > 0.3) {
                    const otherTeams = teams.filter(t => t !== team);
                    opponent = otherTeams[Math.floor(Math.random() * otherTeams.length)];
                } else {
                    opponent = this.getRandomOpponent(sport, category, team);
                }

                const match = {
                    id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    sport: 'football',
                    category: category,
                    team1: team,
                    team2: opponent,
                    date: matchDate.toISOString().split('T')[0],
                    time: this.generateRandomTime(),
                    venue: venues[Math.floor(Math.random() * venues.length)],
                    league: leagues[Math.floor(Math.random() * leagues.length)],
                    status: 'upcoming',
                    saved: false,
                    notificationEnabled: false
                };

                matches.push(match);
            }
        });

        return matches;
    },

    // Generate cricket matches
    async generateCricketMatches(teams, category) {
        const matches = [];

        // Try to load schedules from JSON files first
        for (const team of teams) {
            if (window.ScheduleLoader) {
                try {
                    const scheduleData = await window.ScheduleLoader.loadScheduleFromJSON('cricket', category, team);
                    if (scheduleData && scheduleData.length > 0) {
                        const scheduleMatches = window.ScheduleLoader.convertToMatches(scheduleData, 'cricket', category, team);
                        if (scheduleMatches && scheduleMatches.length > 0) {
                            matches.push(...scheduleMatches);
                            continue; // Skip random generation if schedule found
                        }
                    }
                } catch (error) {
                    console.warn(`Error loading schedule for ${team}:`, error);
                }
            }

            // Fallback to random generation if no schedule file found
            const tournaments = category === 'ipl'
                ? ['IPL', 'IPL Playoffs', 'IPL Final']
                : ['Test Series', 'ODI Series', 'T20 Series', 'World Cup', 'Champions Trophy'];

            const venues = [
                'Wankhede Stadium', 'Eden Gardens', 'M. Chinnaswamy Stadium',
                'Lord\'s Cricket Ground', 'MCG', 'SCG', 'The Oval'
            ];

            const matchCount = 3 + Math.floor(Math.random() * 3);

            for (let i = 0; i < matchCount; i++) {
                const daysFromNow = 7 + (i * 10) + Math.floor(Math.random() * 5);
                const matchDate = new Date();
                matchDate.setDate(matchDate.getDate() + daysFromNow);

                let opponent;
                if (teams.length > 1 && Math.random() > 0.3) {
                    const otherTeams = teams.filter(t => t !== team);
                    opponent = otherTeams[Math.floor(Math.random() * otherTeams.length)];
                } else {
                    opponent = this.getRandomOpponent('cricket', category, team);
                }

                const match = {
                    id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    sport: 'cricket',
                    category: category,
                    team1: team,
                    team2: opponent,
                    date: matchDate.toISOString().split('T')[0],
                    time: this.generateRandomTime(),
                    venue: venues[Math.floor(Math.random() * venues.length)],
                    league: tournaments[Math.floor(Math.random() * tournaments.length)],
                    status: 'upcoming',
                    saved: false,
                    notificationEnabled: false
                };

                matches.push(match);
            }
        }

        return matches;
    },

    // Generate F1 matches (races)
    async generateF1Matches(teams, category) {
        const matches = [];
        // The selection is now "2026 Season" or similar, but we load the generic 'F1' schedule
        // In the backend, we have F1/F1_Schedule.json which works for team="F1"
        const teamForSchedule = 'F1';

        if (window.ScheduleLoader) {
            try {
                // We load the schedule for 'F1'
                const scheduleData = await window.ScheduleLoader.loadScheduleFromJSON('f1', category, teamForSchedule);
                if (scheduleData && scheduleData.length > 0) {
                    // Convert to matches using the special F1 logic in convertToMatches (it handles team names differently)
                    const scheduleMatches = window.ScheduleLoader.convertToMatches(scheduleData, 'f1', category, teamForSchedule);
                    if (scheduleMatches && scheduleMatches.length > 0) {
                        matches.push(...scheduleMatches);
                        return matches;
                    }
                }
            } catch (error) {
                console.warn('[DEBUG] Error loading F1 schedule:', error);
            }
        }

        // Fallback: If schedule loading fails, return empty list or minimal placeholder
        console.warn('[DEBUG] Using fallback/random F1 generation because schedule load failed.');

        const races = [
            'Bahrain Grand Prix', 'Saudi Arabian Grand Prix', 'Australian Grand Prix',
            'Monaco Grand Prix', 'British Grand Prix', 'Italian Grand Prix',
            'Singapore Grand Prix', 'Japanese Grand Prix', 'Brazilian Grand Prix',
            'Abu Dhabi Grand Prix'
        ];

        const venues = [
            'Bahrain International Circuit', 'Jeddah Corniche Circuit', 'Albert Park',
            'Circuit de Monaco', 'Silverstone', 'Monza', 'Marina Bay', 'Suzuka', 'Interlagos', 'Yas Marina'
        ];

        // Even if multiple "teams" selected (should only be "2026 Season"), generate one set of races
        const raceCount = 5; // Fallback count

        for (let i = 0; i < raceCount; i++) {
            const daysFromNow = 14 + (i * 14) + Math.floor(Math.random() * 7);
            const matchDate = new Date();
            matchDate.setDate(matchDate.getDate() + daysFromNow);

            const raceIndex = i % races.length;

            const match = {
                id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                sport: 'f1',
                category: category,
                team1: 'Formula 1',
                team2: races[raceIndex],
                date: matchDate.toISOString().split('T')[0],
                time: '14:00',
                venue: venues[raceIndex],
                league: races[raceIndex],
                status: 'upcoming',
                saved: false,
                notificationEnabled: false
            };

            matches.push(match);
        }

        return matches;
    },

    // Get random opponent
    getRandomOpponent(sport, category, currentTeam) {
        if (sport === 'football') {
            if (category === 'club') {
                const clubs = ['Arsenal', 'Chelsea', 'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa'];
                return clubs[Math.floor(Math.random() * clubs.length)];
            } else {
                const countries = ['Mexico', 'Japan', 'South Korea', 'Canada', 'Australia', 'Morocco'];
                return countries[Math.floor(Math.random() * countries.length)];
            }
        } else if (sport === 'cricket') {
            if (category === 'ipl') {
                const iplTeams = ['Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Delhi Capitals', 'Sunrisers Hyderabad'];
                return iplTeams[Math.floor(Math.random() * iplTeams.length)];
            } else {
                const countries = ['Zimbabwe', 'Ireland', 'Afghanistan', 'Netherlands', 'Scotland'];
                return countries[Math.floor(Math.random() * countries.length)];
            }
        } else {
            return 'Competitor';
        }
    },

    // Generate random time
    generateRandomTime() {
        const hours = 10 + Math.floor(Math.random() * 10); // 10 AM to 8 PM
        const minutes = Math.random() > 0.5 ? '00' : '30';
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    },

    // Save match to user profile
    saveMatch(match) {
        const savedMatch = {
            ...match,
            saved: true,
            userId: window.Auth && window.Auth.isAuthenticated()
                ? window.Auth.getCurrentUser()?.userId
                : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return API.saveMatch(savedMatch);
    },

    // Get all saved matches for current user
    getSavedMatches() {
        const userId = window.Auth && window.Auth.isAuthenticated()
            ? window.Auth.getCurrentUser()?.userId
            : null;

        return API.getMatches(userId);
    },

    // Delete match
    deleteMatch(matchId) {
        return API.deleteMatch(matchId);
    },

    // Update match
    updateMatch(matchId, updates) {
        return API.updateMatch(matchId, updates);
    },

    // Format match date for display
    formatMatchDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    // Format match time for display
    formatMatchTime(timeString) {
        return timeString;
    },

    // Get status color
    getStatusColor(status) {
        const colors = {
            'upcoming': '#4caf50',
            'live': '#f44336',
            'completed': '#9e9e9e'
        };
        return colors[status] || '#9e9e9e';
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Matches = Matches;
}

