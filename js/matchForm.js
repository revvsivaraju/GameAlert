// Match Form Handler
document.addEventListener('DOMContentLoaded', function() {
    setupMatchForm();
});

function setupMatchForm() {
    const form = document.getElementById('matchForm');
    const sportSelect = document.getElementById('matchSport');
    const categorySelect = document.getElementById('matchCategory');
    
    // Update category options when sport changes
    sportSelect.addEventListener('change', function() {
        updateCategoryOptions(this.value);
    });
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleMatchSubmit();
    });
    
    // Set minimum date to today
    const dateInput = document.getElementById('matchDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

function updateCategoryOptions(sport) {
    const categorySelect = document.getElementById('matchCategory');
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    if (sport === 'football') {
        categorySelect.innerHTML += `
            <option value="club">Club</option>
            <option value="international">International</option>
        `;
    } else if (sport === 'cricket') {
        categorySelect.innerHTML += `
            <option value="international">International</option>
            <option value="ipl">IPL</option>
        `;
    } else if (sport === 'f1') {
        categorySelect.innerHTML += `
            <option value="teams">Teams</option>
            <option value="drivers">Drivers</option>
        `;
    }
}

let editingMatchId = null;

function populateMatchForm(match) {
    if (!match) return;
    
    editingMatchId = match.id;
    document.getElementById('matchSport').value = match.sport;
    updateCategoryOptions(match.sport);
    
    // Wait for category options to update
    setTimeout(() => {
        document.getElementById('matchCategory').value = match.category;
        document.getElementById('matchTeam1').value = match.team1;
        document.getElementById('matchTeam2').value = match.team2;
        document.getElementById('matchDate').value = match.date;
        document.getElementById('matchTime').value = match.time;
        document.getElementById('matchVenue').value = match.venue;
        document.getElementById('matchLeague').value = match.league;
        document.getElementById('matchStatus').value = match.status;
    }, 150);
}

async function handleMatchSubmit() {
    const form = document.getElementById('matchForm');
    const formData = new FormData(form);
    
    const matchData = {
        sport: formData.get('sport'),
        category: formData.get('category'),
        team1: formData.get('team1'),
        team2: formData.get('team2'),
        date: formData.get('date'),
        time: formData.get('time'),
        venue: formData.get('venue'),
        league: formData.get('league'),
        status: formData.get('status'),
        notificationEnabled: false
    };
    
    // Validation
    if (!matchData.sport || !matchData.category || !matchData.team1 || !matchData.team2) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        if (editingMatchId) {
            // Update existing match
            await API.updateMatch(editingMatchId, matchData);
            showMessage('Match updated successfully!', 'success');
        } else {
            // Create new match
            const userId = window.Auth && window.Auth.isAuthenticated() 
                ? window.Auth.getCurrentUser()?.userId 
                : null;
            
            const newMatch = {
                ...matchData,
                id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                userId: userId,
                saved: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            await API.saveMatch(newMatch);
            showMessage('Match added successfully!', 'success');
        }
        
        // Close modal and reload matches
        closeMatchModal();
        if (window.loadMatches) {
            window.loadMatches();
        }
    } catch (error) {
        showMessage(error.message || 'Failed to save match', 'error');
    }
}

function closeMatchModal() {
    document.getElementById('matchModal').classList.add('hidden');
    document.getElementById('matchForm').reset();
    editingMatchId = null;
    if (window.editingMatchId !== undefined) {
        window.editingMatchId = null;
    }
    document.getElementById('matchCategory').innerHTML = '<option value="">Select Category</option>';
}

function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.add('show');
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// Export for use in dashboard.js
if (typeof window !== 'undefined') {
    window.populateMatchForm = populateMatchForm;
    window.closeMatchModal = closeMatchModal;
    window.editingMatchId = editingMatchId;
}

