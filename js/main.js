// Add click event listeners to sport boxes and handle auth state
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    checkAuthState();
    
    // Setup sport box click handlers
    const sportBoxes = document.querySelectorAll('.sport-box');
    
    sportBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const sport = this.getAttribute('data-sport');
            // Navigate to selection page with sport parameter
            window.location.href = `selection.html?sport=${sport}`;
        });
        
        // Add keyboard accessibility
        box.setAttribute('tabindex', '0');
        box.setAttribute('role', 'button');
        box.setAttribute('aria-label', `Select ${box.querySelector('.sport-title').textContent}`);
        
        box.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Setup logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (window.Auth && window.Auth.logout) {
                window.Auth.logout();
            }
        });
    }
});

// Check authentication state and update UI
function checkAuthState() {
    // Wait for Auth to be available (auth.js is loaded in index.html)
    if (typeof window.Auth !== 'undefined') {
        updateAuthUI();
    } else {
        // Retry after a short delay if Auth hasn't loaded yet
        setTimeout(() => {
            if (typeof window.Auth !== 'undefined') {
                updateAuthUI();
            }
        }, 100);
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const userInfo = document.getElementById('userInfo');
    const loginButton = document.getElementById('loginButton');
    const userName = document.getElementById('userName');
    
    if (window.Auth && window.Auth.isAuthenticated()) {
        const user = window.Auth.getCurrentUser();
        if (user) {
            // Show user info, hide login button
            if (userInfo) {
                userInfo.classList.remove('hidden');
            }
            if (loginButton) {
                loginButton.classList.add('hidden');
            }
            if (userName) userName.textContent = user.name;
        }
    } else {
        // Show login button, hide user info
        if (userInfo) {
            userInfo.classList.add('hidden');
        }
        if (loginButton) {
            loginButton.classList.remove('hidden');
        }
    }
}

