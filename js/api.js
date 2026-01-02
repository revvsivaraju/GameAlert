// API for saving user selections (with AWS Cognito token support)
const API = {
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
    
    // Simulate API call with delay (in production, this would call your backend API)
    async saveSelections(sport, selections, category = null) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Get current user if logged in
                    let userId = null;
                    let idToken = null;
                    
                    if (window.Auth && window.Auth.isAuthenticated()) {
                        const user = window.Auth.getCurrentUser();
                        if (user) {
                            userId = user.userId;
                        }
                        idToken = window.Auth.getIdToken();
                    }
                    
                    // In a real app, this would be a fetch call to your backend API:
                    /*
                    const response = await fetch('https://your-api.com/selections', {
                        method: 'POST',
                        headers: this.getAuthHeaders(),
                        body: JSON.stringify({
                            sport: sport,
                            category: category,
                            selections: selections
                        })
                    });
                    const data = await response.json();
                    */
                    
                    // For now, we'll save to localStorage and log to console
                    const data = {
                        userId: userId,
                        sport: sport,
                        category: category,
                        selections: selections,
                        timestamp: new Date().toISOString(),
                        // Include token info for reference (in production, tokens are sent in headers)
                        hasAuth: !!idToken
                    };
                    
                    // Save to localStorage
                    const savedData = JSON.parse(localStorage.getItem('sportsSelections') || '[]');
                    savedData.push(data);
                    localStorage.setItem('sportsSelections', JSON.stringify(savedData));
                    
                    // Simulate successful response
                    resolve({
                        success: true,
                        message: 'Selections saved successfully!',
                        data: data
                    });
                } catch (error) {
                    reject({
                        success: false,
                        message: 'Failed to save selections. Please try again.',
                        error: error
                    });
                }
            }, 1000); // 1 second delay to simulate network request
        });
    },
    
    // Get saved selections (optional - for future use)
    getSelections(sport, userId = null) {
        try {
            const savedData = JSON.parse(localStorage.getItem('sportsSelections') || '[]');
            let filtered = savedData.filter(item => item.sport === sport);
            
            // If user is logged in, filter by userId; otherwise show only non-user selections
            if (userId) {
                filtered = filtered.filter(item => item.userId === userId);
            } else {
                filtered = filtered.filter(item => !item.userId);
            }
            
            return filtered;
        } catch (error) {
            console.error('Error getting selections:', error);
            return [];
        }
    },
    
    // Get user's saved selections
    getUserSelections(userId) {
        try {
            const savedData = JSON.parse(localStorage.getItem('sportsSelections') || '[]');
            return savedData.filter(item => item.userId === userId);
        } catch (error) {
            console.error('Error getting user selections:', error);
            return [];
        }
    }
};

