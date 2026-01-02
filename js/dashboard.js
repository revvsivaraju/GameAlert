// Dashboard Main Logic
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    if (!window.Auth || !window.Auth.isAuthenticated()) {
        window.location.href = 'login.html?redirect=dashboard';
        return;
    }

    initializeDashboard();
});

function initializeDashboard() {
    setupEventListeners();
    setupSportFilters();
    setupTeamSelector();

    // Check URL for sport parameter (from redirect after login/signup)
    const urlParams = new URLSearchParams(window.location.search);
    const sportParam = urlParams.get('sport');
    if (sportParam && ['cricket', 'football', 'f1'].includes(sportParam)) {
        currentSport = sportParam;
        // Update active filter button
        document.querySelectorAll('.sport-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-sport') === sportParam) {
                btn.classList.add('active');
            }
        });
    }

    // Load teams and schedules for default sport
    loadTeamsForSport(currentSport);
    loadSchedulesForSport(currentSport);
}

function setupSportFilters() {
    document.querySelectorAll('.sport-filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active state
            document.querySelectorAll('.sport-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Get sport from button
            const sport = this.getAttribute('data-sport');
            currentSport = sport;

            if (sport === 'saved') {
                loadSavedMatchesView();
            } else {
                // Show team selection section again if hidden
                const teamSelectionSection = document.getElementById('teamSelectionSection');
                if (teamSelectionSection) {
                    teamSelectionSection.style.display = '';
                }
                // Load teams and schedules for selected sport
                loadTeamsForSport(sport);
                loadSchedulesForSport(sport);
            }
        });
    });
}

// Helper to load saved matches view
async function loadSavedMatchesView() {
    try {
        // Hide team selection section completely
        const teamSelectionSection = document.getElementById('teamSelectionSection');
        if (teamSelectionSection) {
            teamSelectionSection.style.display = 'none';
        }

        const scheduleContent = document.getElementById('scheduleContent');
        scheduleContent.innerHTML = '<div class="loading-spinner">Loading saved matches...</div>';

        const userId = window.Auth.getCurrentUser()?.userId;
        if (!userId) {
            scheduleContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔐</div>
                    <h3>Please log in</h3>
                    <p>Log in to view your saved matches</p>
                </div>
            `;
            return;
        }

        // Get all saved matches
        const savedMatches = await API.getMatches(userId);

        if (savedMatches.length === 0) {
            scheduleContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <h3>No saved matches</h3>
                    <p>You haven't saved any matches yet. Go to Cricket, Football, or F1 and click the bell icon to save matches with reminders.</p>
                </div>
            `;
            return;
        }

        // Display them using existing display/list logic
        displaySchedules(savedMatches, 'saved');

    } catch (error) {
        console.error('Error loading saved matches:', error);
        showMessage('Failed to load saved matches', 'error');
    }
}

// Load and display teams for the selected sport
async function loadTeamsForSport(sport) {
    try {
        const scheduleTitle = document.getElementById('scheduleTitle');
        const selectedTeamsDisplay = document.getElementById('selectedTeamsDisplay');
        const teamSelectorBox = document.getElementById('teamSelectorBox');

        // Update title
        const sportNames = {
            'cricket': 'Cricket',
            'football': 'Football',
            'f1': 'Formula 1'
        };
        scheduleTitle.textContent = sportNames[sport] || sport;

        // Get user's selections for this sport
        const userId = window.Auth.getCurrentUser()?.userId;
        if (!userId) {
            selectedTeamsDisplay.innerHTML = '<p class="no-teams">Please log in to view teams.</p>';
            return;
        }

        const allUserSelections = await API.getUserSelections(userId);
        const sportSelections = allUserSelections.filter(s => s.sport === sport);

        // Display selected teams
        displaySelectedTeams(sport, sportSelections);

        // Load team selector options
        loadTeamSelectorOptions(sport, sportSelections);

    } catch (error) {
        console.error('Error loading teams:', error);
    }
}

function displaySelectedTeams(sport, selections) {
    const selectedTeamsDisplay = document.getElementById('selectedTeamsDisplay');

    if (!selections || selections.length === 0) {
        selectedTeamsDisplay.innerHTML = '<p class="no-teams">No teams selected. Click "Edit Teams" to add teams.</p>';
        return;
    }

    // Collect all selected teams
    const allTeams = [];
    selections.forEach(selection => {
        selection.selections.forEach(team => {
            allTeams.push({
                team: team,
                category: selection.category
            });
        });
    });

    if (allTeams.length === 0) {
        selectedTeamsDisplay.innerHTML = '<p class="no-teams">No teams selected. Click "Edit Teams" to add teams.</p>';
        return;
    }

    // Display teams as badges with delete buttons
    selectedTeamsDisplay.innerHTML = allTeams.map(({ team, category }) => {
        const categoryLabel = category ? ` (${category})` : '';
        return `<span class="team-badge-display" data-sport="${sport}" data-category="${category}" data-team="${team}">
            ${team}${categoryLabel}
            <button class="delete-team-btn" onclick="deleteTeamFromSelection('${sport}', '${category}', '${team}')" title="Remove team">×</button>
        </span>`;
    }).join('');
}

function loadTeamSelectorOptions(sport, currentSelections) {
    const teamSelectorOptions = document.getElementById('teamSelectorOptions');

    // Get sport data (from selection.js)
    const sportDataObj = window.sportData && window.sportData[sport];
    if (!sportDataObj) {
        teamSelectorOptions.innerHTML = '<p>No teams available for this sport.</p>';
        return;
    }

    // Get current selected teams
    const currentTeams = new Set();
    currentSelections.forEach(selection => {
        selection.selections.forEach(team => {
            currentTeams.add(team);
        });
    });

    // Build selector for each category
    let html = '';
    Object.keys(sportDataObj.categories).forEach(categoryKey => {
        const category = sportDataObj.categories[categoryKey];
        html += `<div class="category-selector-group">
            <h4 class="category-selector-title">${category.name}</h4>
            <div class="team-checkboxes">`;

        category.options.forEach(option => {
            const isChecked = currentTeams.has(option.name);
            html += `<label class="team-checkbox-label">
                <input type="checkbox" 
                       class="team-checkbox" 
                       data-sport="${sport}" 
                       data-category="${categoryKey}" 
                       data-team="${option.name}" 
                       ${isChecked ? 'checked' : ''}>
                <span class="team-flag">${option.flag}</span>
                <span class="team-name">${option.name}</span>
            </label>`;
        });

        html += `</div></div>`;
    });

    teamSelectorOptions.innerHTML = html;
}

async function saveTeamSelection() {
    try {
        const sport = currentSport;
        const checkboxes = document.querySelectorAll(`.team-checkbox[data-sport="${sport}"]`);

        // Group by category
        const selectionsByCategory = {};
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const category = checkbox.getAttribute('data-category');
                const team = checkbox.getAttribute('data-team');

                if (!selectionsByCategory[category]) {
                    selectionsByCategory[category] = [];
                }
                selectionsByCategory[category].push(team);
            }
        });

        // Save each category selection
        for (const [category, teams] of Object.entries(selectionsByCategory)) {
            if (teams.length > 0) {
                await API.saveSelections(sport, teams, category);
            } else {
                // If no teams selected for a category, remove that category selection
                const userId = window.Auth.getCurrentUser()?.userId;
                if (userId) {
                    // Delete selection for this category if it exists
                    try {
                        await API.deleteSelection(userId, sport, category);
                    } catch (e) {
                        // Ignore if doesn't exist
                    }
                }
            }
        }

        // Hide selector
        document.getElementById('teamSelectorBox').classList.add('hidden');

        // Reload teams and schedules
        await loadTeamsForSport(sport);
        await loadSchedulesForSport(sport);

        // Only show message if teams were actually changed
        showMessage('Teams updated successfully!', 'success');
    } catch (error) {
        console.error('Error saving team selection:', error);
        showMessage('Failed to save teams', 'error');
    }
}

// Delete team from selection
async function deleteTeamFromSelection(sport, category, team) {
    try {
        const userId = window.Auth.getCurrentUser()?.userId;
        if (!userId) {
            showMessage('Please log in to remove teams', 'error');
            return;
        }

        // Get current selections
        const allSelections = await API.getUserSelections(userId);
        const selection = allSelections.find(s => s.sport === sport && s.category === category);

        if (!selection) {
            return;
        }

        // Remove the team
        const updatedTeams = selection.selections.filter(t => t !== team);

        if (updatedTeams.length === 0) {
            // Delete entire selection if no teams left
            await API.deleteSelection(userId, sport, category);
        } else {
            // Update selection with remaining teams
            await API.saveSelections(sport, updatedTeams, category);
        }

        // Reload teams and schedules
        await loadTeamsForSport(sport);
        await loadSchedulesForSport(sport);

        // Don't show message for every deletion - it's disruptive
        // showMessage('Team removed successfully', 'success');
    } catch (error) {
        console.error('Error removing team:', error);
        showMessage('Failed to remove team', 'error');
    }
}

// Make function globally available
window.deleteTeamFromSelection = deleteTeamFromSelection;

function setupEventListeners() {
    // Add match button
    const addMatchButton = document.getElementById('addMatchButton');
    if (addMatchButton) {
        addMatchButton.addEventListener('click', () => {
            openMatchModal();
        });
    }

    // Modal close
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeMatchModal);
    }

    const cancelMatchBtn = document.getElementById('cancelMatchBtn');
    if (cancelMatchBtn) {
        cancelMatchBtn.addEventListener('click', closeMatchModal);
    }

    const matchModal = document.getElementById('matchModal');
    if (matchModal) {
        matchModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeMatchModal();
            }
        });
    }
}

function setupTeamSelector() {
    // Edit teams button
    const editBtn = document.getElementById('editTeamsBtn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const selectorBox = document.getElementById('teamSelectorBox');
            selectorBox.classList.toggle('hidden');
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelTeamSelection');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('teamSelectorBox').classList.add('hidden');
        });
    }

    // Save button
    const saveBtn = document.getElementById('saveTeamSelection');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            await saveTeamSelection();
        });
    }
}

let allMatches = [];
let currentFilter = 'all';
let userSelections = [];
let currentSport = 'cricket'; // Default to cricket

// Removed unused functions: switchDashboardTab, displayFavorites, openEditFavoritesModal, closeEditFavoritesModal, deleteFavoriteSelection, removeTeamFromFavorite

async function loadMatches() {
    try {
        const userId = window.Auth.getCurrentUser()?.userId;
        allMatches = await API.getMatches(userId);

        // Check for generated matches from selection page
        const generatedMatches = sessionStorage.getItem('generatedMatches');
        if (generatedMatches) {
            const matches = JSON.parse(generatedMatches);
            // Add generated matches to the list (they're not saved yet)
            allMatches = [...allMatches, ...matches];
            sessionStorage.removeItem('generatedMatches');
        }

        // Sort by date (upcoming first)
        allMatches.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        // Make allMatches available globally for calendar
        window.allMatches = allMatches;

        displayMatches(allMatches);
        updateCalendar();

        if (allMatches.length === 0) {
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.classList.remove('hidden');

            const listView = document.getElementById('listView');
            if (listView) listView.classList.add('hidden');
        } else {
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.classList.add('hidden');

            const listView = document.getElementById('listView');
            if (listView) listView.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading matches:', error);
        // Only show error message if it's not a DOM error
        if (!error.message.includes('null')) {
            showMessage('Failed to load matches', 'error');
        }
    }
}

// Export loadMatches globally
window.loadMatches = loadMatches;

function displayMatches(matches) {
    const matchesGrid = document.getElementById('matchesGrid');
    matchesGrid.innerHTML = '';

    if (matches.length === 0) {
        matchesGrid.innerHTML = '<p class="no-matches">No matches found</p>';
        return;
    }

    // Group by sport
    const grouped = {};
    matches.forEach(match => {
        if (!grouped[match.sport]) {
            grouped[match.sport] = [];
        }
        grouped[match.sport].push(match);
    });

    // Display grouped matches
    Object.keys(grouped).forEach(sport => {
        const sportSection = document.createElement('div');
        sportSection.className = 'sport-section';

        const sportTitle = document.createElement('h2');
        sportTitle.className = 'sport-section-title';
        sportTitle.textContent = sport.charAt(0).toUpperCase() + sport.slice(1);
        sportSection.appendChild(sportTitle);

        const sportMatches = document.createElement('div');
        sportMatches.className = 'sport-matches-grid';

        grouped[sport].forEach(match => {
            sportMatches.appendChild(createMatchCard(match));
        });

        sportSection.appendChild(sportMatches);
        matchesGrid.appendChild(sportSection);
    });
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.setAttribute('data-match-id', match.id);

    const statusColor = Matches.getStatusColor(match.status);
    const statusClass = match.status;

    card.innerHTML = `
        <div class="match-header">
            <span class="match-status ${statusClass}" style="background-color: ${statusColor}">
                ${match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </span>
            <div class="match-actions">
                <button class="action-btn edit-btn" data-match-id="${match.id}" title="Edit">
                    ✏️
                </button>
                <button class="action-btn delete-btn" data-match-id="${match.id}" title="Delete">
                    🗑️
                </button>
            </div>
        </div>
        <div class="match-teams">
            <div class="team team1">${match.team1}</div>
            <div class="vs">vs</div>
            <div class="team team2">${match.team2}</div>
        </div>
        <div class="match-details">
            <div class="match-detail">
                <span class="detail-icon">📅</span>
                <span>${Matches.formatMatchDate(match.date)}</span>
            </div>
            <div class="match-detail">
                <span class="detail-icon">🕐</span>
                <span>${Matches.formatMatchTime(match.time)}</span>
            </div>
            <div class="match-detail">
                <span class="detail-icon">📍</span>
                <span>${match.venue}</span>
            </div>
            <div class="match-detail">
                <span class="detail-icon">🏆</span>
                <span>${match.league}</span>
            </div>
        </div>
        <div class="match-footer">
            <label class="notification-toggle">
                <input type="checkbox" class="notification-checkbox" data-match-id="${match.id}" ${match.notificationEnabled ? 'checked' : ''}>
                <span>Notify me</span>
            </label>
        </div>
    `;

    // Add event listeners
    card.querySelector('.edit-btn').addEventListener('click', () => editMatch(match.id));
    card.querySelector('.delete-btn').addEventListener('click', () => deleteMatch(match.id));
    card.querySelector('.notification-checkbox').addEventListener('change', (e) => {
        toggleNotification(match.id, e.target.checked);
    });

    return card;
}

function filterMatches(filter) {
    currentFilter = filter;
    let filtered = allMatches;

    if (filter !== 'all') {
        filtered = allMatches.filter(match => match.sport === filter);
    }

    displayMatches(filtered);
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();

        if (query === '') {
            filterMatches(currentFilter);
            return;
        }

        let filtered = allMatches;
        if (currentFilter !== 'all') {
            filtered = allMatches.filter(match => match.sport === currentFilter);
        }

        filtered = filtered.filter(match => {
            return match.team1.toLowerCase().includes(query) ||
                match.team2.toLowerCase().includes(query) ||
                match.venue.toLowerCase().includes(query) ||
                match.league.toLowerCase().includes(query);
        });

        displayMatches(filtered);
    });
}

function switchView(view) {
    const listView = document.getElementById('listView');
    const calendarView = document.getElementById('calendarView');
    const listBtn = document.getElementById('listViewBtn');
    const calendarBtn = document.getElementById('calendarViewBtn');

    if (view === 'list') {
        listView.classList.remove('hidden');
        calendarView.classList.add('hidden');
        listBtn.classList.add('active');
        calendarBtn.classList.remove('active');
    } else {
        listView.classList.add('hidden');
        calendarView.classList.remove('hidden');
        listBtn.classList.remove('active');
        calendarBtn.classList.add('active');
        updateCalendar();
    }
}

function openMatchModal(matchId = null) {
    const modal = document.getElementById('matchModal');
    const form = document.getElementById('matchForm');
    const title = document.getElementById('modalTitle');

    if (matchId) {
        title.textContent = 'Edit Match';
        const match = allMatches.find(m => m.id === matchId);
        if (match && window.populateMatchForm) {
            window.populateMatchForm(match);
        }
    } else {
        title.textContent = 'Add Match';
        form.reset();
        document.getElementById('matchCategory').innerHTML = '<option value="">Select Category</option>';
        if (window.editingMatchId !== undefined) {
            window.editingMatchId = null;
        }
    }

    modal.classList.remove('hidden');
}

function closeMatchModal() {
    document.getElementById('matchModal').classList.add('hidden');
    document.getElementById('matchForm').reset();
}

async function editMatch(matchId) {
    openMatchModal(matchId);
}

async function deleteMatch(matchId) {
    if (!confirm('Are you sure you want to delete this match?')) {
        return;
    }

    try {
        await API.deleteMatch(matchId);
        showMessage('Match deleted successfully', 'success');
        loadMatches();
    } catch (error) {
        showMessage('Failed to delete match', 'error');
    }
}

async function toggleNotification(matchId, enabled) {
    try {
        await API.updateMatch(matchId, { notificationEnabled: enabled });
        if (enabled) {
            Notifications.scheduleMatchNotification(matchId);
        } else {
            Notifications.cancelNotification(matchId);
        }
    } catch (error) {
        showMessage('Failed to update notification', 'error');
    }
}

function populateMatchForm(match) {
    document.getElementById('matchSport').value = match.sport;
    updateCategoryOptions(match.sport);
    setTimeout(() => {
        document.getElementById('matchCategory').value = match.category;
    }, 100);
    document.getElementById('matchTeam1').value = match.team1;
    document.getElementById('matchTeam2').value = match.team2;
    document.getElementById('matchDate').value = match.date;
    document.getElementById('matchTime').value = match.time;
    document.getElementById('matchVenue').value = match.venue;
    document.getElementById('matchLeague').value = match.league;
    document.getElementById('matchStatus').value = match.status;
}

async function loadSchedulesForSport(sport) {
    try {
        const scheduleContent = document.getElementById('scheduleContent');

        if (!scheduleContent) {
            return;
        }

        // Show loading state
        scheduleContent.innerHTML = '<div class="loading-spinner">Loading schedules...</div>';

        // Get user's favorite teams for this sport
        const userId = window.Auth.getCurrentUser()?.userId;
        if (!userId) {
            scheduleContent.innerHTML = '<p class="no-schedules">Please log in to view schedules.</p>';
            return;
        }

        const allUserSelections = await API.getUserSelections(userId);
        const sportSelections = allUserSelections.filter(s => s.sport === sport);

        if (sportSelections.length === 0) {
            scheduleContent.innerHTML = '<p class="no-schedules">No favorite teams selected for this sport.</p>';
            return;
        }

        // Collect all teams from all categories for this sport
        const allTeams = [];
        sportSelections.forEach(selection => {
            selection.selections.forEach(team => {
                allTeams.push({
                    team: team,
                    category: selection.category
                });
            });
        });

        if (allTeams.length === 0) {
            scheduleContent.innerHTML = '<p class="no-schedules">No teams selected.</p>';
            return;
        }

        // Load schedules for all teams
        const allSchedules = [];

        // Fetch fresh list of saved matches to check status
        const savedMatches = await API.getMatches(userId);

        for (const { team, category } of allTeams) {
            try {
                // Check if ScheduleLoader is available
                if (!window.ScheduleLoader) {
                    throw new Error('ScheduleLoader is not loaded. Please check the browser console for errors in scheduleLoader.js');
                }

                if (typeof window.ScheduleLoader.loadScheduleFromJSON !== 'function') {
                    throw new Error('ScheduleLoader.loadScheduleFromJSON is not a function. Please refresh the page.');
                }

                const scheduleData = await window.ScheduleLoader.loadScheduleFromJSON(sport, category, team);

                if (scheduleData && Array.isArray(scheduleData)) {
                    // Convert JSON data to match format
                    const matches = window.ScheduleLoader.convertToMatches(scheduleData, sport, category, team);

                    // Check each match against saved matches
                    matches.forEach(match => {
                        const savedMatch = savedMatches.find(m =>
                            m.date === match.date &&
                            (m.team1 === match.team1 || m.team2 === match.team1) &&
                            (m.team1 === match.team2 || m.team2 === match.team2)
                        );

                        if (savedMatch) {
                            match.id = savedMatch.id;
                            match.saved = true;
                            match.notificationEnabled = savedMatch.notificationEnabled || false;
                        }
                    });

                    allSchedules.push(...matches);
                }
            } catch (error) {
                console.error(`Failed to load schedule for ${team} (${category}):`, error);

            }
        }

        console.log(`Total schedules loaded: ${allSchedules.length}`);

        // Display schedules in list format
        displaySchedules(allSchedules, sport);

    } catch (error) {
        console.error('Error loading schedules:', error);
        const scheduleContent = document.getElementById('scheduleContent');
        scheduleContent.innerHTML = `<p class="no-schedules">Error loading schedules: ${error.message}</p>`;
        showMessage('Failed to load schedules', 'error');
    }
}

function displaySchedules(schedules, sport) {
    const scheduleContent = document.getElementById('scheduleContent');

    if (!scheduleContent) {
        console.error('Schedule content element not found');
        return;
    }

    if (!schedules || schedules.length === 0) {
        scheduleContent.innerHTML = '<p class="no-schedules">No schedules available for your favorite teams.</p>';
        return;
    }

    console.log(`Displaying ${schedules.length} schedules`);

    // Sort schedules by date
    schedules.sort((a, b) => {
        try {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA - dateB;
        } catch (e) {
            return 0;
        }
    });

    // Create simple list format
    scheduleContent.innerHTML = '';
    const scheduleList = document.createElement('ul');
    scheduleList.className = 'schedule-list-items';

    let itemsCreated = 0;
    schedules.forEach(match => {
        try {
            // For saved view, ensure 'saved' property is true and 'notificationEnabled' is respected
            if (sport === 'saved') {
                match.saved = true;
                // db matches might have 'notificationEnabled' set, ensure it's passed
            }

            const listItem = createScheduleListItem(match);
            scheduleList.appendChild(listItem);
            itemsCreated++;
        } catch (error) {
            console.error('Error creating schedule list item:', error, match);
        }
    });

    scheduleContent.appendChild(scheduleList);
}

function createScheduleListItem(match) {
    const li = document.createElement('li');
    li.className = 'schedule-list-item';

    const date = new Date(`${match.date}T${match.time || '00:00'}`);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = match.time ? date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }) : 'TBA';

    // Get status and color
    const status = match.status || 'scheduled';
    const statusColors = {
        'scheduled': '#2196F3',
        'live': '#F44336',
        'completed': '#4CAF50'
    };
    const statusColor = statusColors[status] || '#2196F3';

    let innerHTML = '';

    if (match.sport === 'f1') {
        const sessionLabel = match.session || 'Race Day';
        innerHTML = `
            <div class="schedule-item-content f1-schedule">
                <div class="schedule-item-main">
                    <div class="schedule-item-teams">
                        <span class="f1-session-badge">${sessionLabel}</span>
                        <span class="f1-circuit-name">${match.competition || 'Grand Prix'}</span>
                    </div>
                    <div class="schedule-item-details">
                        <span class="schedule-detail-item">
                            <span class="detail-icon">📅</span>
                            ${formattedDate}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">🕐</span>
                            ${formattedTime}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">🏎️</span>
                            ${match.venue || 'Circuit'}
                        </span>
                    </div>
                </div>
        `;
    } else if (match.sport === 'cricket') {
        const formatBadge = match.format ? `<span class="format-badge">${match.format}</span>` : '';
        innerHTML = `
            <div class="schedule-item-content">
                <div class="schedule-item-main">
                    <div class="schedule-item-teams">
                        <span class="team-name">${match.team1 || 'TBA'}</span>
                        <span class="vs">vs</span>
                        <span class="team-name">${match.team2 || 'TBA'}</span>
                        ${formatBadge}
                    </div>
                    <div class="schedule-item-details">
                        <span class="schedule-detail-item">
                            <span class="detail-icon">📅</span>
                            ${formattedDate}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">🕐</span>
                            ${formattedTime}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">🏏</span>
                            ${match.league || 'Series'}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">📍</span>
                            ${match.venue}
                        </span>
                    </div>
                </div>
        `;
    } else if (match.sport === 'football') {
        const matchdayInfo = match.matchday ? `<span class="matchday-info">${match.matchday}</span>` : '';
        innerHTML = `
            <div class="schedule-item-content">
                <div class="schedule-item-main">
                    <div class="schedule-item-teams">
                        <span class="team-name">${match.team1 || 'TBA'}</span>
                        <span class="vs">vs</span>
                        <span class="team-name">${match.team2 || 'TBA'}</span>
                    </div>
                    <div class="schedule-item-details">
                        <span class="schedule-detail-item">
                            <span class="detail-icon">📅</span>
                            ${formattedDate}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">🕐</span>
                            ${formattedTime}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">⚽</span>
                            ${match.competition || match.league || 'League'} ${matchdayInfo}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">📍</span>
                            ${match.venue}
                        </span>
                    </div>
                </div>
        `;
    } else {
        // Fallback for other sports
        innerHTML = `
            <div class="schedule-item-content">
                <div class="schedule-item-main">
                    <div class="schedule-item-teams">
                        <span class="team-name">${match.team1 || 'TBA'}</span>
                        <span class="vs">vs</span>
                        <span class="team-name">${match.team2 || 'TBA'}</span>
                    </div>
                    <div class="schedule-item-details">
                        <span class="schedule-detail-item">
                            <span class="detail-icon">📅</span>
                            ${formattedDate}
                        </span>
                        <span class="schedule-detail-item">
                            <span class="detail-icon">🕐</span>
                            ${formattedTime}
                        </span>
                        ${match.venue && match.venue !== 'TBA' ? `
                        <span class="schedule-detail-item">
                            <span class="detail-icon">📍</span>
                            ${match.venue}
                        </span>
                        ` : ''}
                        ${match.league ? `
                        <span class="schedule-detail-item">
                            <span class="detail-icon">🏆</span>
                            ${match.league}
                        </span>
                        ` : ''}
                    </div>
                </div>
        `;
    }

    const isSaved = match.saved;
    const notificationActive = match.notificationEnabled;
    const bellClass = notificationActive ? 'active' : '';
    const bellTitle = notificationActive ? 'Turn off reminder' : 'Set reminder';

    // SVG Icons
    const bellIconSvg = notificationActive
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;

    li.innerHTML = innerHTML + `
            <div class="schedule-item-actions">
                <span class="schedule-status-badge" style="background-color: ${statusColor}">
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <button class="reminder-btn ${bellClass}" data-match='${JSON.stringify(match).replace(/'/g, "&apos;")}' title="${bellTitle}">
                    ${bellIconSvg}
                </button>
            </div>
        </div>
    `;

    // Add event listener to reminder button
    const reminderBtn = li.querySelector('.reminder-btn');
    if (reminderBtn) {
        reminderBtn.addEventListener('click', async function () {
            const matchData = JSON.parse(this.getAttribute('data-match'));
            await toggleScheduleNotification(matchData, this);
        });
    }

    return li;
}


async function saveScheduleMatch(match) {
    try {
        // Ensure match has required fields
        const matchToSave = {
            sport: match.sport || currentSport,
            category: match.category || null,
            team1: match.team1 || 'TBA',
            team2: match.team2 || 'TBA',
            date: match.date,
            time: match.time || '00:00',
            venue: match.venue || 'TBA',
            league: match.league || match.tournament || 'TBA',
            status: 'upcoming',
            notificationEnabled: false
        };

        const response = await API.saveMatch(matchToSave);
        if (response.success) {
            showMessage('Match saved successfully!', 'success');
            // Reload matches to show the new one
            loadMatches();
        } else {
            showMessage(response.message || 'Failed to save match', 'error');
        }
    } catch (error) {
        console.error('Error saving match:', error);
        showMessage('Failed to save match', 'error');
    }
}

function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.add('show');

    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

async function toggleScheduleNotification(match, btnElement) {
    try {
        // If match is not saved yet, save it first with notification enabled
        if (!match.saved) {
            const matchToSave = {
                sport: match.sport || currentSport,
                category: match.category || null,
                team1: match.team1 || 'TBA',
                team2: match.team2 || 'TBA',
                date: match.date,
                time: match.time || '00:00',
                venue: match.venue || 'TBA',
                league: match.league || match.tournament || 'TBA',
                status: 'upcoming',
                notificationEnabled: true
            };

            const response = await API.saveMatch(matchToSave);
            if (response.success) {
                // Update match object with saved data
                match.id = response.data.id;
                match.saved = true;
                match.notificationEnabled = true;

                // Update UI
                if (btnElement) {
                    const activeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`;
                    btnElement.innerHTML = activeSvg;
                    btnElement.classList.add('active');
                    btnElement.title = 'Turn off reminder';
                    btnElement.setAttribute('data-match', JSON.stringify(match));
                }

                Notifications.scheduleMatchNotification(match.id);
                showMessage('Match saved with reminder', 'success');
            } else {
                showMessage(response.message || 'Failed to save match', 'error');
            }
            return;
        }

        // Match is already saved, toggle notification
        const newStatus = !match.notificationEnabled;
        await API.updateMatch(match.id, { notificationEnabled: newStatus });

        // Update local object
        match.notificationEnabled = newStatus;

        // Update UI
        if (btnElement) {
            // SVG Icons
            const activeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`;
            const inactiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;

            btnElement.innerHTML = newStatus ? activeSvg : inactiveSvg;
            btnElement.title = newStatus ? 'Turn off reminder' : 'Set reminder';

            if (newStatus) {
                btnElement.classList.add('active');
                Notifications.scheduleMatchNotification(match.id);
                showMessage('Reminder set', 'success');
            } else {
                btnElement.classList.remove('active');
                Notifications.cancelNotification(match.id);
                showMessage('Reminder cancelled', 'info');
            }

            // Update data attribute
            btnElement.setAttribute('data-match', JSON.stringify(match));
        }
    } catch (error) {
        console.error('Error toggling notification:', error);
        showMessage('Failed to update reminder', 'error');
    }
}

// Export functions for use in other files
window.openMatchModal = openMatchModal;
window.editMatch = editMatch;
window.deleteMatch = deleteMatch;
window.deleteTeamFromSelection = deleteTeamFromSelection;

