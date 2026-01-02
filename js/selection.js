// Sport-specific data with categories
const sportData = {
    football: {
        title: 'Football',
        categories: {
            club: {
                name: 'Club',
                subtitle: 'Select clubs you want to follow',
                options: [
                    { name: 'Real Madrid', flag: '⚪' },
                    { name: 'Barcelona', flag: '🔵' },
                    { name: 'Manchester United', flag: '🔴' },
                    { name: 'Liverpool', flag: '🔴' },
                    { name: 'Manchester City', flag: '🔵' },
                    { name: 'Chelsea', flag: '🔵' },
                    { name: 'Arsenal', flag: '🔴' },
                    { name: 'Bayern Munich', flag: '🔴' },
                    { name: 'Paris Saint-Germain', flag: '🔵' },
                    { name: 'Juventus', flag: '⚫' },
                    { name: 'AC Milan', flag: '🔴' },
                    { name: 'Inter Milan', flag: '🔵' },
                    { name: 'Atletico Madrid', flag: '🔴' },
                    { name: 'Borussia Dortmund', flag: '🟡' },
                    { name: 'Tottenham', flag: '⚪' }
                ]
            },
            international: {
                name: 'International',
                subtitle: 'Select countries you want to follow',
                options: [
                    { name: 'Brazil', flag: '🇧🇷' },
                    { name: 'Argentina', flag: '🇦🇷' },
                    { name: 'France', flag: '🇫🇷' },
                    { name: 'Germany', flag: '🇩🇪' },
                    { name: 'Spain', flag: '🇪🇸' },
                    { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                    { name: 'Italy', flag: '🇮🇹' },
                    { name: 'Portugal', flag: '🇵🇹' },
                    { name: 'Netherlands', flag: '🇳🇱' },
                    { name: 'Belgium', flag: '🇧🇪' },
                    { name: 'Croatia', flag: '🇭🇷' },
                    { name: 'Uruguay', flag: '🇺🇾' },
                    { name: 'Mexico', flag: '🇲🇽' },
                    { name: 'Japan', flag: '🇯🇵' },
                    { name: 'South Korea', flag: '🇰🇷' }
                ]
            }
        }
    },
    cricket: {
        title: 'Cricket',
        categories: {
            international: {
                name: 'International',
                subtitle: 'Select countries you want to follow',
                options: [
                    { name: 'India', flag: '🇮🇳' },
                    { name: 'Australia', flag: '🇦🇺' },
                    { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                    { name: 'Pakistan', flag: '🇵🇰' },
                    { name: 'South Africa', flag: '🇿🇦' },
                    { name: 'New Zealand', flag: '🇳🇿' },
                    { name: 'West Indies', flag: '🏝️' },
                    { name: 'Sri Lanka', flag: '🇱🇰' },
                    { name: 'Bangladesh', flag: '🇧🇩' },
                    { name: 'Afghanistan', flag: '🇦🇫' },
                    { name: 'Ireland', flag: '🇮🇪' },
                    { name: 'Zimbabwe', flag: '🇿🇼' }
                ]
            },
            ipl: {
                name: 'IPL',
                subtitle: 'Select IPL teams you want to follow',
                options: [
                    { name: 'Mumbai Indians', flag: '🔵' },
                    { name: 'Chennai Super Kings', flag: '🟡' },
                    { name: 'Royal Challengers Bangalore', flag: '🔴' },
                    { name: 'Kolkata Knight Riders', flag: '🟣' },
                    { name: 'Delhi Capitals', flag: '🔵' },
                    { name: 'Sunrisers Hyderabad', flag: '🟠' },
                    { name: 'Rajasthan Royals', flag: '🩷' },
                    { name: 'Punjab Kings', flag: '🔴' },
                    { name: 'Gujarat Titans', flag: '🔵' },
                    { name: 'Lucknow Super Giants', flag: '🔵' }
                ]
            }
        }
    },
    f1: {
        title: 'Formula 1',
        categories: {
            teams: {
                name: 'Teams',
                subtitle: 'Select teams you want to follow',
                options: [
                    { name: 'Ferrari', flag: '🔴' },
                    { name: 'Mercedes', flag: '🔵' },
                    { name: 'Red Bull', flag: '🔵' },
                    { name: 'McLaren', flag: '🟠' },
                    { name: 'Alpine', flag: '🔵' },
                    { name: 'Aston Martin', flag: '🟢' },
                    { name: 'AlphaTauri', flag: '🔵' },
                    { name: 'Alfa Romeo', flag: '🔴' },
                    { name: 'Haas', flag: '⚪' },
                    { name: 'Williams', flag: '🔵' }
                ]
            },
            drivers: {
                name: 'Drivers',
                subtitle: 'Select drivers you want to follow',
                options: [
                    { name: 'Max Verstappen', flag: '🇳🇱' },
                    { name: 'Lewis Hamilton', flag: '🇬🇧' },
                    { name: 'Charles Leclerc', flag: '🇲🇨' },
                    { name: 'Carlos Sainz', flag: '🇪🇸' },
                    { name: 'Lando Norris', flag: '🇬🇧' },
                    { name: 'George Russell', flag: '🇬🇧' },
                    { name: 'Fernando Alonso', flag: '🇪🇸' },
                    { name: 'Sergio Perez', flag: '🇲🇽' },
                    { name: 'Oscar Piastri', flag: '🇦🇺' },
                    { name: 'Pierre Gasly', flag: '🇫🇷' },
                    { name: 'Esteban Ocon', flag: '🇫🇷' },
                    { name: 'Lance Stroll', flag: '🇨🇦' },
                    { name: 'Yuki Tsunoda', flag: '🇯🇵' },
                    { name: 'Valtteri Bottas', flag: '🇫🇮' },
                    { name: 'Kevin Magnussen', flag: '🇩🇰' }
                ]
            }
        }
    }
};

// Make sportData available globally for dashboard.js
window.sportData = sportData;

// Get sport from URL parameter
function getSportFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sport') || 'football';
}

// Get category from URL parameter
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category') || null;
}

// Load category selection or options based on URL
function loadOptions() {
    const optionsGrid = document.getElementById('optionsGrid');
    if (!optionsGrid) return;

    const sport = getSportFromURL();
    const category = getCategoryFromURL();
    const data = sportData[sport];

    if (!data) {
        // Invalid sport, redirect to home
        window.location.href = 'index.html';
        return;
    }

    // If no category selected, show category selection
    if (!category) {
        loadCategories(sport, data);
    } else {
        // Load options for selected category
        const categoryData = data.categories[category];
        if (!categoryData) {
            // Invalid category, show categories again
            loadCategories(sport, data);
            return;
        }
        loadCategoryOptions(sport, category, categoryData);
    }
}

// Load category selection screen
function loadCategories(sport, data) {
    document.getElementById('sportTitle').textContent = data.title;
    document.getElementById('sportSubtitle').textContent = 'Choose a category';

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.className = 'options-grid loading';
    optionsGrid.innerHTML = '<div class="loading-spinner"></div>';

    setTimeout(() => {
        optionsGrid.className = 'options-grid category-grid';
        optionsGrid.innerHTML = '';

        // Create category cards
        Object.keys(data.categories).forEach((categoryKey, index) => {
            const category = data.categories[categoryKey];
            const card = document.createElement('div');
            card.className = 'option-card category-card';
            card.setAttribute('data-category', categoryKey);
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="category-icon">${getCategoryIcon(sport, categoryKey)}</div>
                <p class="option-name">${category.name}</p>
            `;

            card.addEventListener('click', function () {
                const selectedCategory = this.getAttribute('data-category');
                window.location.href = `selection.html?sport=${sport}&category=${selectedCategory}`;
            });

            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${category.name}`);

            card.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            optionsGrid.appendChild(card);
        });

        // Hide save button and selected count on category selection
        const saveButton = document.getElementById('saveButton');
        const selectedCount = document.getElementById('selectedCount');
        if (saveButton) saveButton.classList.add('hidden');
        if (selectedCount) selectedCount.classList.add('hidden');
    }, 300);
}

// Get icon for category
function getCategoryIcon(sport, category) {
    if (sport === 'football') {
        return category === 'club' ? '🏆' : '🌍';
    } else if (sport === 'cricket') {
        return category === 'ipl' ? '🏏' : '🌍';
    } else if (sport === 'f1') {
        return category === 'teams' ? '🏎️' : '👤';
    }
    return '⚽';
}

// Load options for selected category
function loadCategoryOptions(sport, category, categoryData) {
    document.getElementById('sportTitle').textContent = `${sportData[sport].title} - ${categoryData.name}`;
    document.getElementById('sportSubtitle').textContent = categoryData.subtitle;

    // Show save button and selected count
    const saveButton = document.getElementById('saveButton');
    const selectedCount = document.getElementById('selectedCount');
    if (saveButton) {
        saveButton.classList.remove('hidden');
    }
    if (selectedCount) {
        selectedCount.classList.remove('hidden');
    }

    // Update back button to go back to category selection
    const backButton = document.querySelector('.back-button');
    backButton.onclick = function () {
        window.location.href = `selection.html?sport=${sport}`;
    };

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.className = 'options-grid loading';
    optionsGrid.innerHTML = '<div class="loading-spinner"></div>';

    setTimeout(() => {
        optionsGrid.className = 'options-grid';
        optionsGrid.innerHTML = '';

        // Create option cards
        categoryData.options.forEach((option, index) => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.setAttribute('data-option', option.name);
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="option-flag">${option.flag}</div>
                <p class="option-name">${option.name}</p>
            `;

            // Add click event
            card.addEventListener('click', function () {
                toggleSelection(this);
            });

            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${option.name}`);

            card.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSelection(this);
                }
            });

            optionsGrid.appendChild(card);
        });

        // Update selected count
        updateSelectedCount();
    }, 300);
}

// Toggle selection on option card
function toggleSelection(card) {
    card.classList.toggle('selected');
    updateSelectedCount();
}

// Update selected count display
function updateSelectedCount() {
    const selectedCards = document.querySelectorAll('.option-card.selected');
    const count = selectedCards.length;
    document.getElementById('selectedCount').textContent = `${count} selected`;

    // Enable/disable save button
    const saveButton = document.getElementById('saveButton');
    saveButton.disabled = count === 0;
}

// Get selected options
function getSelectedOptions() {
    const selectedCards = document.querySelectorAll('.option-card.selected');
    return Array.from(selectedCards).map(card => card.getAttribute('data-option'));
}

// Show message
function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.add('show');

    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// Get temporary selections from sessionStorage
function getTempSelections() {
    try {
        const temp = sessionStorage.getItem('tempSelections');
        return temp ? JSON.parse(temp) : [];
    } catch (error) {
        console.error('Error getting temp selections:', error);
        return [];
    }
}

// Clear temporary selections
function clearTempSelections() {
    sessionStorage.removeItem('tempSelections');
}

// Save selections
async function saveSelections() {
    const sport = getSportFromURL();
    const category = getCategoryFromURL();
    const selections = getSelectedOptions();

    if (selections.length === 0) {
        showMessage('Please select at least one option', 'error');
        return;
    }

    // Check if user is logged in
    const isLoggedIn = window.Auth && window.Auth.isAuthenticated();

    const saveButton = document.getElementById('saveButton');
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="save-icon">⏳</span> Saving...';

    try {
        if (!isLoggedIn) {
            // Store temporarily in sessionStorage
            const tempSelections = getTempSelections();
            const newSelection = {
                sport: sport,
                category: category,
                selections: selections,
                timestamp: new Date().toISOString()
            };

            // Check if selection for this sport/category already exists
            const existingIndex = tempSelections.findIndex(
                s => s.sport === sport && s.category === category
            );

            if (existingIndex >= 0) {
                tempSelections[existingIndex] = newSelection;
            } else {
                tempSelections.push(newSelection);
            }

            sessionStorage.setItem('tempSelections', JSON.stringify(tempSelections));

            // Show signup prompt
            showSignupPrompt(sport);

            // Reset button
            saveButton.innerHTML = '<span class="save-icon">💾</span> Save Selections';
            saveButton.disabled = false;
        } else {
            // User is logged in, save normally
            const response = await API.saveSelections(sport, selections, category);
            showMessage(response.message, 'success');

            // Generate matches for selected teams
            if (window.Matches) {
                const generatedMatches = await Matches.generateMatches([{
                    sport: sport,
                    category: category,
                    teams: selections
                }]);

                // Store generated matches temporarily (user can save them in dashboard)
                sessionStorage.setItem('generatedMatches', JSON.stringify(generatedMatches));
            }

            // Reset button after a delay
            setTimeout(() => {
                saveButton.innerHTML = '<span class="save-icon">💾</span> Save Selections';
                saveButton.disabled = false;
            }, 2000);
        }
    } catch (error) {
        showMessage(error.message || 'Failed to save selections', 'error');
        saveButton.innerHTML = '<span class="save-icon">💾</span> Save Selections';
        saveButton.disabled = false;
    }
}

// Show signup prompt banner
function showSignupPrompt(sport) {
    // Remove existing prompt if any
    const existingPrompt = document.getElementById('signupPrompt');
    if (existingPrompt) {
        existingPrompt.remove();
    }

    // Create prompt banner
    const prompt = document.createElement('div');
    prompt.id = 'signupPrompt';
    prompt.className = 'signup-prompt';
    prompt.innerHTML = `
        <div class="signup-prompt-content">
            <div class="signup-prompt-icon">👤</div>
            <div class="signup-prompt-text">
                <h3>Sign up to create your profile and save your selections</h3>
                <p>Your selections have been saved temporarily. Create an account to access them from your dashboard.</p>
            </div>
            <button class="signup-prompt-button" id="signupPromptButton">
                Sign Up Now
            </button>
        </div>
    `;

    // Insert before selection actions
    const selectionActions = document.querySelector('.selection-actions');
    selectionActions.parentNode.insertBefore(prompt, selectionActions);

    // Add event listener to signup button
    document.getElementById('signupPromptButton').addEventListener('click', function () {
        // Store current URL to redirect back after signup
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterSignup', currentUrl);

        // Redirect to login page with signup mode
        window.location.href = 'login.html?signup=true&redirect=dashboard';
    });

    // Animate in
    setTimeout(() => {
        prompt.classList.add('show');
    }, 100);
}

// Check and display user info if logged in
function checkAndDisplayUserInfo() {
    if (window.Auth && window.Auth.isAuthenticated()) {
        const user = window.Auth.getCurrentUser();
        if (user) {
            const userInfoSelection = document.getElementById('userInfoSelection');
            const userNameSelection = document.getElementById('userNameSelection');
            if (userInfoSelection) {
                userInfoSelection.classList.remove('hidden');
            }
            if (userNameSelection) userNameSelection.textContent = user.name;
        }
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check auth state
    checkAndDisplayUserInfo();

    loadOptions();

    // Add event listener to save button
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveSelections);
    }

    // Check if there are temp selections and user is now logged in
    const isLoggedIn = window.Auth && window.Auth.isAuthenticated();
    if (isLoggedIn) {
        const tempSelections = getTempSelections();
        if (tempSelections.length > 0) {
            // Show message that selections can be migrated
            showMessage('You have temporary selections. They will be saved to your account.', 'info');
        }
    }
});

