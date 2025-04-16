
// Initialize Language Switcher
function initLanguageSwitcher() {
    const langSwitcher = document.querySelector('.lang-switcher select');
    
    if (langSwitcher) {
        // Check if user previously selected a language
        const savedLang = localStorage.getItem('selectedLanguage');
        
        if (savedLang) {
            langSwitcher.value = savedLang;
            setLanguage(savedLang);
        } else {
            // Set default language to French
            langSwitcher.value = 'fr';
            setLanguage('fr');
        }
        
        // Add event listener to language switcher
        langSwitcher.addEventListener('change', function() {
            const selectedLang = this.value;
            setLanguage(selectedLang);
            localStorage.setItem('selectedLanguage', selectedLang);
        });
    }
}

// Set Language
function setLanguage(lang) {
    // Set the document direction for RTL (Arabic) or LTR (other languages)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Load the appropriate language file
    fetch(`lang/${lang}.json`)
        .then(response => response.json())
        .then(translations => {
            // Apply translations to all elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });
            
            // Apply translations to placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (translations[key]) {
                    element.setAttribute('placeholder', translations[key]);
                }
            });
        })
        .catch(error => {
            console.error('Error loading language file:', error);
        });
}
