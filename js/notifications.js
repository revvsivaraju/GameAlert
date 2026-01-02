// Notifications System
const Notifications = {
    scheduledNotifications: new Map(),
    
    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    },
    
    // Schedule notification for a match
    async scheduleMatchNotification(matchId) {
        const matches = await API.getMatches();
        const match = matches.find(m => m.id === matchId);
        
        if (!match) return;
        
        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
            console.warn('Notification permission not granted');
            return;
        }
        
        const matchDateTime = new Date(`${match.date}T${match.time}`);
        const now = new Date();
        
        // Schedule notification 1 hour before match
        const notificationTime = new Date(matchDateTime.getTime() - 60 * 60 * 1000);
        
        if (notificationTime <= now) {
            console.warn('Match time is too soon or has passed');
            return;
        }
        
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        const timeoutId = setTimeout(() => {
            this.showMatchNotification(match);
        }, timeUntilNotification);
        
        this.scheduledNotifications.set(matchId, timeoutId);
        
        // Update match with notification time
        await API.updateMatch(matchId, {
            notificationEnabled: true,
            notificationTime: notificationTime.toISOString()
        });
    },
    
    // Show notification for a match
    showMatchNotification(match) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(`${match.team1} vs ${match.team2}`, {
                body: `Match starts at ${match.time} at ${match.venue}`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `match-${match.id}`,
                requireInteraction: false
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            // Auto close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    },
    
    // Cancel notification for a match
    cancelNotification(matchId) {
        const timeoutId = this.scheduledNotifications.get(matchId);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.scheduledNotifications.delete(matchId);
        }
    },
    
    // Schedule all enabled notifications
    async scheduleAllNotifications() {
        const matches = await API.getMatches();
        const userId = window.Auth && window.Auth.isAuthenticated() 
            ? window.Auth.getCurrentUser()?.userId 
            : null;
        
        const userMatches = userId 
            ? matches.filter(m => m.userId === userId && m.notificationEnabled)
            : matches.filter(m => !m.userId && m.notificationEnabled);
        
        for (const match of userMatches) {
            await this.scheduleMatchNotification(match.id);
        }
    },
    
    // Check and update notification status for matches
    async checkMatchStatuses() {
        const matches = await API.getMatches();
        const now = new Date();
        
        for (const match of matches) {
            const matchDateTime = new Date(`${match.date}T${match.time}`);
            
            if (matchDateTime <= now && match.status === 'upcoming') {
                await API.updateMatch(match.id, { status: 'completed' });
            } else if (matchDateTime <= now && matchDateTime.getTime() + 3 * 60 * 60 * 1000 >= now.getTime() && match.status === 'upcoming') {
                await API.updateMatch(match.id, { status: 'live' });
            }
        }
    }
};

// Initialize notifications when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Request permission on dashboard load
    if (window.location.pathname.includes('dashboard')) {
        Notifications.requestPermission();
        Notifications.scheduleAllNotifications();
        Notifications.checkMatchStatuses();
        
        // Check statuses every 5 minutes
        setInterval(() => {
            Notifications.checkMatchStatuses();
        }, 5 * 60 * 1000);
    }
});

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Notifications = Notifications;
}

