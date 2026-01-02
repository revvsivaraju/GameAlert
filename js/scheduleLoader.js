// Schedule Loader - Loads schedules from JSON files
(function () {
    'use strict';

    // Explicitly define on window to avoid any scope issues
    window.ScheduleLoader = {
        // Load schedule from JSON file (via FastAPI backend)
        async loadScheduleFromJSON(sport, category, team) {
            try {
                const apiBaseURL = window.API?.baseURL || 'http://127.0.0.1:8000';
                // Double encode only if needed, but standard URL encoding should handle space
                const encodedTeam = encodeURIComponent(team);
                const url = `${apiBaseURL}/api/schedules/${sport}/${category}/${encodedTeam}`;

                console.log('[DEBUG] ScheduleLoader.loadScheduleFromJSON - API call', { url, sport, category, team });

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('[DEBUG] ScheduleLoader.loadScheduleFromJSON - Response', {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        console.warn(`[DEBUG] Schedule file not found for ${team} (${sport}/${category})`);
                        return null;
                    }
                    const errorText = await response.text();
                    console.error('[DEBUG] API error response', { status: response.status, errorText });
                    throw new Error(`Failed to load schedule: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('[DEBUG] ScheduleLoader.loadScheduleFromJSON - Parsed data', {
                    success: data.success,
                    hasData: !!data.data,
                    dataLength: data.data?.length || 0,
                    count: data.count,
                    sample: data.data?.[0]
                });

                if (data.success && data.data) {
                    return data.data;
                }

                return null;
            } catch (error) {
                console.error('[DEBUG] ScheduleLoader.loadScheduleFromJSON - Error', { error: error.message, stack: error.stack });
                console.error('Error loading schedule:', error);
                return null;
            }
        },

        // Convert JSON schedule data to match format
        convertToMatches(scheduleData, sport, category, team) {
            const matches = [];

            if (!Array.isArray(scheduleData)) {
                console.warn('[DEBUG] Schedule data is not an array', scheduleData);
                return matches;
            }

            scheduleData.forEach(row => {
                // JSON format handling
                const matchDate = row.date || '';
                const matchTime = row.time || '';

                // Skip TBA dates
                if (!matchDate || matchDate.includes('TBA') || matchDate === 'TBA') {
                    return;
                }

                // Handle team(home) and opponent(away)
                const homeTeam = (row['team(home)'] || '').trim();
                const awayTeam = (row['opponent(away)'] || '').trim();

                // Check if selected team is in this match
                const teamNormalized = team.trim().toLowerCase();
                const isHomeTeam = homeTeam.toLowerCase() === teamNormalized;
                const isAwayTeam = awayTeam.toLowerCase() === teamNormalized;

                // If selected team is not in this match, skip it
                if (!isHomeTeam && !isAwayTeam) {
                    return;
                }

                // Set team1 as the selected team, team2 as the opponent
                let team1, team2;
                if (isHomeTeam) {
                    team1 = homeTeam;
                    team2 = awayTeam;
                } else {
                    team1 = awayTeam;
                    team2 = homeTeam;
                }

                const venue = row.location || 'TBA';
                const league = row.series || 'International';
                const format = row.format || '';

                // Status is already calculated by backend, use it
                const status = row.status || this.calculateMatchStatus(matchDate, matchTime);

                // Parse and format date
                let parsedDate;
                try {
                    // Handle partial dates
                    if (matchDate.includes('-TBA') || matchDate === 'TBA') {
                        return; // Skip TBA dates
                    }

                    parsedDate = new Date(matchDate);
                    if (isNaN(parsedDate.getTime())) {
                        return; // Invalid date
                    }
                } catch (e) {
                    return; // Skip invalid dates
                }

                // Format time - convert from "1:30 PM IST" to "13:30" or keep as is if already in HH:MM format
                let formattedTime = matchTime;
                if (matchTime && matchTime !== 'TBA' && (matchTime.includes('PM') || matchTime.includes('AM'))) {
                    // Convert "1:30 PM" to "13:30"
                    formattedTime = this.convertTimeTo24Hour(matchTime);
                } else if (!matchTime || matchTime === 'TBA') {
                    // Default to 2 PM if no time
                    formattedTime = '14:00';
                }

                // Create match object
                const match = {
                    id: `schedule_${team}_${parsedDate.toISOString().split('T')[0]}_${Math.random().toString(36).substring(2, 9)}`,
                    sport: sport,
                    category: category,
                    team1: team1,
                    team2: team2,
                    date: parsedDate.toISOString().split('T')[0],
                    time: formattedTime,
                    venue: venue,
                    league: league,
                    format: format,
                    status: status,
                    saved: false,
                    notificationEnabled: false,
                    source: 'schedule'
                };

                matches.push(match);
            });

            return matches;
        },

        // Calculate match status based on current date/time
        calculateMatchStatus(matchDate, matchTime) {
            try {
                if (!matchDate || matchDate.includes('TBA')) {
                    return 'scheduled';
                }

                // Parse date
                const dateParts = matchDate.split('-');
                if (dateParts.length < 3 || dateParts[1] === 'TBA' || dateParts[2] === 'TBA') {
                    return 'scheduled';
                }

                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]);
                const day = parseInt(dateParts[2]);

                let matchDateTime = new Date(year, month - 1, day);

                // Parse time if available
                if (matchTime && matchTime !== 'TBA') {
                    const timeStr = matchTime.replace(' IST', '').replace(' LOCAL', '').trim();
                    if (timeStr.includes('PM') || timeStr.includes('AM')) {
                        const time24 = this.convertTimeTo24Hour(timeStr);
                        const [hours, minutes] = time24.split(':').map(Number);
                        matchDateTime.setHours(hours, minutes, 0, 0);
                    } else if (timeStr.includes(':')) {
                        const [hours, minutes] = timeStr.split(':').map(Number);
                        matchDateTime.setHours(hours, minutes, 0, 0);
                    }
                } else {
                    // Default to 2 PM
                    matchDateTime.setHours(14, 0, 0, 0);
                }

                const now = new Date();
                const matchEnd = new Date(matchDateTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration

                if (now < matchDateTime) {
                    return 'scheduled';
                } else if (matchDateTime <= now && now <= matchEnd) {
                    return 'live';
                } else {
                    return 'completed';
                }
            } catch (e) {
                return 'scheduled';
            }
        },

        // Convert 12-hour time to 24-hour format
        convertTimeTo24Hour(timeStr) {
            try {
                const time = timeStr.replace(' IST', '').replace(' LOCAL', '').trim();
                const isPM = time.includes('PM');
                const isAM = time.includes('AM');
                const timeOnly = time.replace(/AM|PM/gi, '').trim();
                const [hours, minutes] = timeOnly.split(':').map(Number);

                let hour24 = hours;
                if (isPM && hours !== 12) {
                    hour24 = hours + 12;
                } else if (isAM && hours === 12) {
                    hour24 = 0;
                }

                return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } catch (e) {
                return '14:00'; // Default
            }
        },

    };

    console.log('[DEBUG] ScheduleLoader initialized and assigned to window', {
        keys: Object.keys(window.ScheduleLoader),
        timestamp: new Date().toISOString()
    });

})();
