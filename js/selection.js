// Sport-specific data with categories
// Using official team logos from reliable CDN sources
const sportData = {
    football: {
        title: 'Football',
        categories: {
            club: {
                name: 'Club',
                subtitle: 'Select clubs you want to follow',
                options: [
                    { name: 'Real Madrid', logo: 'images/logos/football/real_madrid.png' },
                    { name: 'Barcelona', logo: 'images/logos/football/barcelona.png' },
                    { name: 'Manchester United', logo: 'images/logos/football/manchester_united.png' },
                    { name: 'Liverpool', logo: 'images/logos/football/liverpool.png' },
                    { name: 'Manchester City', logo: 'images/logos/football/manchester_city.png' },
                    { name: 'Chelsea', logo: 'images/logos/football/chelsea.png' },
                    { name: 'Arsenal', logo: 'images/logos/football/arsenal.png' },
                    { name: 'Bayern Munich', logo: 'images/logos/football/bayern_munich.png' },
                    { name: 'Paris Saint-Germain', logo: 'images/logos/football/psg.png' },
                    { name: 'Juventus', logo: 'images/logos/football/juventus.png' },
                    { name: 'AC Milan', logo: 'images/logos/football/ac_milan.png' },
                    { name: 'Inter Milan', logo: 'images/logos/football/inter_milan.png' },
                    { name: 'Atletico Madrid', logo: 'images/logos/football/atletico_madrid.png' },
                    { name: 'Borussia Dortmund', logo: 'images/logos/football/dortmund.png' },
                    { name: 'Tottenham', logo: 'images/logos/football/tottenham.png' }
                ]
            },
            international: {
                name: 'International',
                subtitle: 'Select countries you want to follow',
                options: [
                    { name: 'Brazil', flag: '🇧🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/CBF_logo_2018.svg' },
                    { name: 'Argentina', flag: '🇦🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Argentina_national_football_team_logo.svg' },
                    { name: 'France', flag: '🇫🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/6/62/French_Football_Federation_Logo.svg' },
                    { name: 'Germany', flag: '🇩🇪', logo: 'https://upload.wikimedia.org/wikipedia/en/e/e3/DFB-Logo.svg' },
                    { name: 'Spain', flag: '🇪🇸', logo: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Royal_Spanish_Football_Federation_logo.svg' },
                    { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://upload.wikimedia.org/wikipedia/en/b/be/Football_Association_England_logo.svg' },
                    { name: 'Italy', flag: '🇮🇹', logo: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Italian_Football_Federation.svg' },
                    { name: 'Portugal', flag: '🇵🇹', logo: 'https://upload.wikimedia.org/wikipedia/en/0/05/Portuguese_Football_Federation.svg' },
                    { name: 'Netherlands', flag: '🇳🇱', logo: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Royal_Dutch_Football_Association_logo.svg' },
                    { name: 'Belgium', flag: '🇧🇪', logo: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Royal_Belgian_Football_Association_logo.svg' },
                    { name: 'Croatia', flag: '🇭🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Croatian_Football_Federation_logo.svg' },
                    { name: 'Uruguay', flag: '🇺🇾', logo: 'https://upload.wikimedia.org/wikipedia/en/4/40/Uruguayan_Football_Association_logo.svg' },
                    { name: 'Mexico', flag: '🇲🇽', logo: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Mexico_national_football_team_seal.svg' },
                    { name: 'Japan', flag: '🇯🇵', logo: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Japan_Football_Association_logo.svg' },
                    { name: 'South Korea', flag: '🇰🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/e/ec/Korea_Football_Association.svg' }
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
                    { name: 'India', flag: '🇮🇳', logo: 'https://upload.wikimedia.org/wikipedia/en/8/8d/BCCI_logo.svg' },
                    { name: 'Australia', flag: '🇦🇺', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Cricket_Australia.svg' },
                    { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://upload.wikimedia.org/wikipedia/en/f/fd/England_and_Wales_Cricket_Board_logo.svg' },
                    { name: 'Pakistan', flag: '🇵🇰', logo: 'https://upload.wikimedia.org/wikipedia/en/3/36/Pakistan_Cricket_Board_logo.svg' },
                    { name: 'South Africa', flag: '🇿🇦', logo: 'https://upload.wikimedia.org/wikipedia/en/2/28/Cricket_South_Africa_logo.svg' },
                    { name: 'New Zealand', flag: '🇳🇿', logo: 'https://upload.wikimedia.org/wikipedia/en/b/bd/New_Zealand_Cricket_logo.svg' },
                    { name: 'West Indies', flag: '🏝️', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Cricket_West_Indies_Logo_%282017%29.svg' },
                    { name: 'Sri Lanka', flag: '🇱🇰', logo: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Sri_Lanka_Cricket.svg' },
                    { name: 'Bangladesh', flag: '🇧🇩', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d2/Bangladesh_Cricket_Board.svg' },
                    { name: 'Afghanistan', flag: '🇦🇫', logo: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Afghanistan_Cricket_Board_logo.svg' },
                    { name: 'Ireland', flag: '🇮🇪', logo: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Cricket_Ireland_logo.svg' },
                    { name: 'Zimbabwe', flag: '🇿🇼', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Zimbabwe_Cricket_logo.svg' }
                ]
            },
            ipl: {
                name: 'IPL',
                subtitle: 'Select IPL teams you want to follow',
                options: [
                    { name: 'Mumbai Indians', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg' },
                    { name: 'Chennai Super Kings', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg' },
                    { name: 'Royal Challengers Bangalore', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Royal_Challengers_Bengaluru_Logo.svg' },
                    { name: 'Kolkata Knight Riders', logo: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg' },
                    { name: 'Delhi Capitals', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Delhi_Capitals_Logo.png' },
                    { name: 'Sunrisers Hyderabad', logo: 'https://upload.wikimedia.org/wikipedia/en/5/51/Sunrisers_Hyderabad_Logo.svg' },
                    { name: 'Rajasthan Royals', logo: 'https://upload.wikimedia.org/wikipedia/en/5/5c/This_is_the_logo_for_Rajasthan_Royals%2C_a_cricket_team_playing_in_the_Indian_Premier_League_%28IPL%29.svg' },
                    { name: 'Punjab Kings', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg' },
                    { name: 'Gujarat Titans', logo: 'https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg' },
                    { name: 'Lucknow Super Giants', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Lucknow_Super_Giants_IPL_Logo.svg' }
                ]
            }
        }
    },
    f1: {
        title: 'Formula 1',
        categories: {
            season: {
                name: 'Season',
                subtitle: 'Follow the 2026 F1 Season',
                options: [
                    { name: '2026 Season', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg' }
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

            // Determine what to display in the card - logo or flag
            let displayContent;
            if (option.logo) {
                displayContent = `<div class="option-logo"><img src="${option.logo}" alt="${option.name}" onerror="this.parentElement.innerHTML='${option.flag || ''}'"></div>`;
            } else {
                displayContent = `<div class="option-flag">${option.flag || ''}</div>`;
            }

            card.innerHTML = `
                ${displayContent}
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

