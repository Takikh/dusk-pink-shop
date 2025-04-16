
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // If on cart page, display cart items
    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }
    
    // Add event listener to checkout button
    const checkoutBtn = document.querySelector('#checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', simulatePurchase);
    }
});

// Add product to cart
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

// Remove product from cart
function removeFromCart(productId) {
    // Get existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Remove product from cart
    cartItems = cartItems.filter(item => item.id !== productId);
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Show notification
    showNotification('Product removed from cart!');
    
    // Update cart count
    updateCartCount();
    
    // If on cart page, refresh cart items display
    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    // Get existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Find the item
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        // Update quantity
        cartItems[itemIndex].quantity += change;
        
        // If quantity is 0 or less, remove item from cart
        if (cartItems[itemIndex].quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // If on cart page, refresh cart items display
        if (document.querySelector('.cart-items')) {
            displayCartItems();
        }
    }
}

// Display cart items on the cart page
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer || !cartSummary) return;
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        cartSummary.style.display = 'none';
        return;
    }
    
    let cartHTML = '';
    let totalPrice = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
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
                <button type="button" class="btn-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Update cart summary
    cartSummary.style.display = 'block';
    const totalElement = cartSummary.querySelector('.cart-total-amount');
    if (totalElement) {
        totalElement.textContent = totalPrice.toFixed(2) + ' DZD';
    }
}

// Update cart count in header
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        if (cartCount > 0) {
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Simulate purchase (checkout)
function simulatePurchase() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Clear cart
    localStorage.removeItem('cartItems');
    
    // Update cart display and count
    displayCartItems();
    updateCartCount();
    
    // Show success notification
    showNotification('Purchase successful! Thank you for your order.');
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = 'notification ' + type;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000);
}
