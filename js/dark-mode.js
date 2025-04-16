
// Initialize Dark Mode functionality
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check if user previously enabled dark mode
        if (localStorage.getItem('darkMode') === 'enabled') {
            enableDarkMode();
            updateDarkModeIcon(true);
        }
        
        // Add event listener to dark mode toggle
        darkModeToggle.addEventListener('click', function() {
            // Check if dark mode is currently enabled
            if (document.body.classList.contains('dark-mode')) {
                disableDarkMode();
                updateDarkModeIcon(false);
            } else {
                enableDarkMode();
                updateDarkModeIcon(true);
            }
        });
    }
}

// Enable Dark Mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
}

// Disable Dark Mode
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
}

// Update Dark Mode Icon
function updateDarkModeIcon(isDarkMode) {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        if (isDarkMode) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.title = 'Switch to Light Mode';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeToggle.title = 'Switch to Dark Mode';
        }
    }
}
