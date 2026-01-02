// Mock API for saving user selections
const API = {
    // Simulate API call with delay
    async saveSelections(sport, selections, category = null) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // In a real app, this would be a fetch call to a backend
                    // For now, we'll save to localStorage and log to console
                    const data = {
                        sport: sport,
                        category: category,
                        selections: selections,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Save to localStorage
                    const savedData = JSON.parse(localStorage.getItem('sportsSelections') || '[]');
                    savedData.push(data);
                    localStorage.setItem('sportsSelections', JSON.stringify(savedData));
                    
                    // Log to console (simulating API response)
                    console.log('API Call - Save Selections:', data);
                    
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
    getSelections(sport) {
        try {
            const savedData = JSON.parse(localStorage.getItem('sportsSelections') || '[]');
            return savedData.filter(item => item.sport === sport);
        } catch (error) {
            console.error('Error getting selections:', error);
            return [];
        }
    }
};

