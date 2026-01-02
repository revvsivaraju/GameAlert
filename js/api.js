// API for saving user selections (with AWS Cognito token support)
const API = {
    // Backend API base URL
    baseURL: 'http://127.0.0.1:8000',

    // Get authentication headers for API calls
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add Cognito ID token if available
        if (window.Auth && window.Auth.isAuthenticated()) {
            const idToken = window.Auth.getIdToken();
            if (idToken) {
                headers['Authorization'] = `Bearer ${idToken}`;
            }
        }

        return headers;
    },

    // Helper to get user ID
    getUserId() {
        if (window.Auth && window.Auth.isAuthenticated()) {
            const user = window.Auth.getCurrentUser();
            return user ? user.userId : null;
        }
        return null;
    },

    // Save selections to backend
    async saveSelections(sport, selections, category = null) {
        try {
            const userId = this.getUserId();
            let url = `${this.baseURL}/api/selections`;
            if (userId) {
                url += `?userId=${encodeURIComponent(userId)}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    sport: sport,
                    category: category,
                    selections: selections
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to save selections');
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message || 'Selections saved successfully!',
                data: data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to save selections. Please try again.',
                error: error
            };
        }
    },

    // Get saved selections (optional - for future use)
    async getSelections(sport, userId = null) {
        try {
            const url = userId
                ? `${this.baseURL}/api/selections/${sport}?userId=${userId}`
                : `${this.baseURL}/api/selections/${sport}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error getting selections:', error);
            return [];
        }
    },

    // Get user's saved selections
    async getUserSelections(userId) {
        try {
            const url = userId
                ? `${this.baseURL}/api/selections?userId=${userId}`
                : `${this.baseURL}/api/selections`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error getting user selections:', error);
            return [];
        }
    },

    // Match CRUD Operations
    async saveMatch(match) {
        try {
            const userId = this.getUserId();
            const response = await fetch(`${this.baseURL}/api/matches`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    sport: match.sport,
                    category: match.category,
                    team1: match.team1,
                    team2: match.team2,
                    date: match.date,
                    time: match.time,
                    venue: match.venue,
                    league: match.league,
                    status: match.status || 'upcoming',
                    notificationEnabled: match.notificationEnabled || false
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to save match');
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message || 'Match saved successfully!',
                data: data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to save match. Please try again.',
                error: error
            };
        }
    },

    async getMatches(userId = null) {
        try {
            const url = userId
                ? `${this.baseURL}/api/matches?userId=${userId}`
                : `${this.baseURL}/api/matches`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error getting matches:', error);
            return [];
        }
    },

    async updateMatch(matchId, updates) {
        try {
            const response = await fetch(`${this.baseURL}/api/matches/${matchId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to update match');
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message || 'Match updated successfully!',
                data: data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update match. Please try again.',
                error: error
            };
        }
    },

    async deleteMatch(matchId) {
        try {
            const response = await fetch(`${this.baseURL}/api/matches/${matchId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to delete match');
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message || 'Match deleted successfully!'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to delete match. Please try again.',
                error: error
            };
        }
    },

    // Delete selection
    async deleteSelection(userId, sport, category) {
        try {
            const url = `${this.baseURL}/api/selections/${sport}/${category}?userId=${encodeURIComponent(userId)}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to delete selection');
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message || 'Selection deleted successfully!'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to delete selection. Please try again.',
                error: error
            };
        }
    }
};

