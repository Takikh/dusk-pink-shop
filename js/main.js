
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle
    initSidebar();
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize language switcher
    initLanguageSwitcher();
    
    // Initialize form validation
    initFormValidation();
});

// Sidebar functionality
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('show');
            }
        });
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function() {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
            });
        }
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 991) {
            if (!e.target.closest('.sidebar') && !e.target.closest('.sidebar-toggle')) {
                if (sidebar && sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                    
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.remove('show');
                    }
                }
            }
        }
    });
}

// Navigation toggle for mobile
function initNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Get all required inputs
            const requiredInputs = form.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Add event listeners for real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateInput(this);
                }
            });
        });
    });
}

// Validate a single input
function validateInput(input) {
    const errorElement = input.nextElementSibling;
    let isValid = true;
    let errorMessage = '';
    
    // Check if empty
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } 
    // Check email format
    else if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    // Check password length
    else if (input.type === 'password' && input.hasAttribute('data-min-length') && input.value.trim()) {
        const minLength = parseInt(input.getAttribute('data-min-length'));
        if (input.value.length < minLength) {
            isValid = false;
            errorMessage = `Password must be at least ${minLength} characters`;
        }
    }
    // Check if passwords match
    else if (input.hasAttribute('data-match')) {
        const matchSelector = input.getAttribute('data-match');
        const matchInput = document.querySelector(matchSelector);
        if (matchInput && input.value !== matchInput.value) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
    }
    
    // Update UI based on validation
    if (!isValid) {
        input.classList.add('is-invalid');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = errorMessage;
        } else {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = errorMessage;
            input.parentNode.insertBefore(error, input.nextElementSibling);
        }
    } else {
        input.classList.remove('is-invalid');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
        }
    }
    
    return isValid;
}

// Add to cart function
function addToCart(productId, productName, productPrice, productImage) {
    // Get existing cart items from localStorage or initialize empty array
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // If product exists, increment quantity
        cartItems[existingItemIndex].quantity += 1;
    } else {
        // If product doesn't exist, add it to cart
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Show notification
    showNotification(`${productName} added to cart!`);
    
    // Update cart count
    updateCartCount();
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    // Get existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Find the item
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        // Update quantity, ensuring it doesn't go below 1
        cartItems[itemIndex].quantity = Math.max(1, cartItems[itemIndex].quantity + change);
        
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Refresh cart display
        displayCartItems();
    }
}

// Remove item from cart
function removeCartItem(productId) {
    // Get existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Filter out the item to remove
    cartItems = cartItems.filter(item => item.id !== productId);
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Refresh cart display
    displayCartItems();
    
    // Update cart count
    updateCartCount();
}

// Update cart item count in the UI
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        if (cartCount > 0) {
            cartCountElement.classList.add('show');
        } else {
            cartCountElement.classList.remove('show');
        }
    }
}

// Display cart items on the cart page
function displayCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    let cartHTML = '';
    let cartTotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${item.price.toFixed(2)} DZD</p>
                </div>
                <div class="cart-item-quantity">
                    <button type="button" onclick="updateCartItemQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateCartItemQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-total">
                    ${itemTotal.toFixed(2)} DZD
                </div>
                <button type="button" class="btn-remove" onclick="removeCartItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    
    // Update cart summary
    document.querySelector('.cart-summary').style.display = 'block';
    document.querySelector('.cart-total-value').textContent = cartTotal.toFixed(2) + ' DZD';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Simulate purchase
function simulatePurchase() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Clear cart
    localStorage.removeItem('cartItems');
    
    // Show success message
    showNotification('Purchase completed successfully!');
    
    // Refresh cart display
    displayCartItems();
    
    // Update cart count
    updateCartCount();
}
