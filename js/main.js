// Add click event listeners to sport boxes
document.addEventListener('DOMContentLoaded', function() {
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
});

