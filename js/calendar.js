// Calendar View Component
const Calendar = {
    currentDate: new Date(),
    matches: [],
    
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
    },
    
    setMatches(matches) {
        this.matches = matches;
        this.render();
    },
    
    render() {
        if (!this.container) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let html = `
            <div class="calendar-header">
                <button class="calendar-nav-btn" id="prevMonth">←</button>
                <h2 class="calendar-month-title">${monthNames[month]} ${year}</h2>
                <button class="calendar-nav-btn" id="nextMonth">→</button>
            </div>
            <div class="calendar-weekdays">
                <div class="weekday">Sun</div>
                <div class="weekday">Mon</div>
                <div class="weekday">Tue</div>
                <div class="weekday">Wed</div>
                <div class="weekday">Thu</div>
                <div class="weekday">Fri</div>
                <div class="weekday">Sat</div>
            </div>
            <div class="calendar-days">
        `;
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayMatches = this.getMatchesForDate(dateStr);
            const isToday = this.isToday(year, month, day);
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${dayMatches.length > 0 ? 'has-matches' : ''}" 
                     data-date="${dateStr}">
                    <div class="day-number">${day}</div>
                    ${dayMatches.length > 0 ? `<div class="match-indicator">${dayMatches.length}</div>` : ''}
                </div>
            `;
        }
        
        html += '</div></div>';
        
        this.container.innerHTML = html;
        
        // Add event listeners
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            });
        }
        
        // Day click handlers
        document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                const date = day.getAttribute('data-date');
                this.showDayMatches(date);
            });
        });
    },
    
    getMatchesForDate(dateStr) {
        return this.matches.filter(match => match.date === dateStr);
    },
    
    isToday(year, month, day) {
        const today = new Date();
        return today.getFullYear() === year &&
               today.getMonth() === month &&
               today.getDate() === day;
    },
    
    showDayMatches(dateStr) {
        const dayMatches = this.getMatchesForDate(dateStr);
        
        if (dayMatches.length === 0) {
            alert('No matches on this date');
            return;
        }
        
        // Create modal or popup to show matches
        let matchesHtml = '<div class="day-matches-popup"><h3>Matches on ' + 
            this.formatDate(dateStr) + '</h3><ul class="day-matches-list">';
        
        dayMatches.forEach(match => {
            matchesHtml += `
                <li class="day-match-item">
                    <strong>${match.team1} vs ${match.team2}</strong><br>
                    <span>${match.time} - ${match.venue}</span><br>
                    <span>${match.league}</span>
                </li>
            `;
        });
        
        matchesHtml += '</ul></div>';
        
        // Show in a simple alert or create a modal
        // For now, using a simple approach
        const popup = document.createElement('div');
        popup.className = 'day-matches-modal';
        popup.innerHTML = matchesHtml;
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            z-index: 2000;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => document.body.removeChild(popup);
        popup.appendChild(closeBtn);
        
        document.body.appendChild(popup);
    },
    
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
};

// Initialize calendar when dashboard loads
function updateCalendar() {
    if (typeof window.allMatches !== 'undefined') {
        Calendar.init('calendarContainer');
        Calendar.setMatches(window.allMatches);
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Calendar = Calendar;
    window.updateCalendar = updateCalendar;
}

