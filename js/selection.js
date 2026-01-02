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
            
            card.addEventListener('click', function() {
                const selectedCategory = this.getAttribute('data-category');
                window.location.href = `selection.html?sport=${sport}&category=${selectedCategory}`;
            });
            
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${category.name}`);
            
            card.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            optionsGrid.appendChild(card);
        });
        
        // Hide save button and selected count on category selection
        document.getElementById('saveButton').style.display = 'none';
        document.getElementById('selectedCount').style.display = 'none';
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
    document.getElementById('saveButton').style.display = 'flex';
    document.getElementById('selectedCount').style.display = 'block';
    
    // Update back button to go back to category selection
    const backButton = document.querySelector('.back-button');
    backButton.onclick = function() {
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
            card.addEventListener('click', function() {
                toggleSelection(this);
            });
            
            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${option.name}`);
            
            card.addEventListener('keypress', function(e) {
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

// Save selections
async function saveSelections() {
    const sport = getSportFromURL();
    const category = getCategoryFromURL();
    const selections = getSelectedOptions();
    
    if (selections.length === 0) {
        showMessage('Please select at least one option', 'error');
        return;
    }
    
    const saveButton = document.getElementById('saveButton');
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="save-icon">⏳</span> Saving...';
    
    try {
        const response = await API.saveSelections(sport, selections, category);
        showMessage(response.message, 'success');
        
        // Reset button after a delay
        setTimeout(() => {
            saveButton.innerHTML = '<span class="save-icon">💾</span> Save Selections';
            saveButton.disabled = false;
        }, 2000);
    } catch (error) {
        showMessage(error.message || 'Failed to save selections', 'error');
        saveButton.innerHTML = '<span class="save-icon">💾</span> Save Selections';
        saveButton.disabled = false;
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadOptions();
    
    // Add event listener to save button
    document.getElementById('saveButton').addEventListener('click', saveSelections);
});

