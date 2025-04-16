
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products on admin page
    if (document.querySelector('.admin-products')) {
        loadAdminProducts();
    }
    
    // Load users on admin page
    if (document.querySelector('.admin-users')) {
        loadAdminUsers();
    }
    
    // Display statistics on dashboard
    if (document.querySelector('.admin-dashboard')) {
        displayStatistics();
    }
    
    // Add event listener to product form
    const productForm = document.querySelector('#product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateProductForm(this)) {
                saveProduct(this);
            }
        });
    }
});

// Load products for admin
function loadAdminProducts() {
    const productsContainer = document.querySelector('.admin-products');
    
    // Fetch products from the API (in real app) or localStorage (for demo)
    // For demo, we'll use localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found</p>';
        return;
    }
    
    let productsHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price (DZD)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    products.forEach(product => {
        productsHTML += `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="admin-product-image"></td>
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                    <button type="button" class="btn-edit" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn-delete" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    productsHTML += `
            </tbody>
        </table>
    `;
    
    productsContainer.innerHTML = productsHTML;
}

// Load users for admin
function loadAdminUsers() {
    const usersContainer = document.querySelector('.admin-users');
    
    // Fetch users from the API (in real app) or localStorage (for demo)
    // For demo, we'll use localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.length === 0) {
        usersContainer.innerHTML = '<p>No users found</p>';
        return;
    }
    
    let usersHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        usersHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button type="button" class="btn-delete" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    usersHTML += `
            </tbody>
        </table>
    `;
    
    usersContainer.innerHTML = usersHTML;
}

// Display statistics on admin dashboard
function displayStatistics() {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Calculate total product value
    const totalProductValue = products.reduce((total, product) => total + product.price, 0);
    
    // Calculate Zakat (2.5% of total product value)
    const zakatAmount = totalProductValue * 0.025;
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Calculate total cart value
    const totalCartValue = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update statistics in the DOM
    document.querySelector('#total-users').textContent = users.length;
    document.querySelector('#total-products').textContent = products.length;
    document.querySelector('#total-product-value').textContent = totalProductValue.toFixed(2) + ' DZD';
    document.querySelector('#total-cart-value').textContent = totalCartValue.toFixed(2) + ' DZD';
    document.querySelector('#zakat-amount').textContent = zakatAmount.toFixed(2) + ' DZD';
    
    // Draw charts
    drawUserRoleChart();
    drawProductValueChart();
}

// Draw user role chart
function drawUserRoleChart() {
    const canvas = document.querySelector('#user-role-chart');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Count users by role
    const adminCount = users.filter(user => user.role === 'admin').length;
    const clientCount = users.filter(user => user.role === 'client').length;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pie chart
    const total = adminCount + clientCount;
    const adminAngle = (adminCount / total) * 2 * Math.PI;
    const clientAngle = (clientCount / total) * 2 * Math.PI;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Draw admin slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, adminAngle);
    ctx.fillStyle = '#9b87f5';
    ctx.fill();
    
    // Draw client slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, adminAngle, adminAngle + clientAngle);
    ctx.fillStyle = '#D946EF';
    ctx.fill();
    
    // Draw legend
    ctx.fillStyle = '#9b87f5';
    ctx.fillRect(10, 10, 20, 20);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('Admin: ' + adminCount, 40, 25);
    
    ctx.fillStyle = '#D946EF';
    ctx.fillRect(10, 40, 20, 20);
    ctx.fillStyle = '#000000';
    ctx.fillText('Client: ' + clientCount, 40, 55);
}

// Draw product value chart
function drawProductValueChart() {
    const canvas = document.querySelector('#product-value-chart');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Sort products by price (descending)
    products.sort((a, b) => b.price - a.price);
    
    // Take top 5 products
    const topProducts = products.slice(0, 5);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bar chart
    const barWidth = canvas.width / (topProducts.length * 2);
    const maxPrice = Math.max(...topProducts.map(product => product.price));
    
    topProducts.forEach((product, index) => {
        const barHeight = (product.price / maxPrice) * (canvas.height - 60);
        const x = index * (barWidth * 2) + barWidth / 2;
        const y = canvas.height - barHeight - 30;
        
        // Draw bar
        ctx.fillStyle = '#9b87f5';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw product name
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(product.name.substring(0, 8) + (product.name.length > 8 ? '...' : ''), x + barWidth / 2, canvas.height - 15);
        
        // Draw price
        ctx.fillText(product.price.toFixed(2), x + barWidth / 2, y - 5);
    });
    
    // Draw Y-axis
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(barWidth / 4, 10);
    ctx.lineTo(barWidth / 4, canvas.height - 30);
    ctx.stroke();
    
    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(barWidth / 4, canvas.height - 30);
    ctx.lineTo(canvas.width - barWidth / 4, canvas.height - 30);
    ctx.stroke();
}

// Edit product
function editProduct(productId) {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Find product by ID
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Populate form fields
    document.querySelector('#product-id').value = product.id;
    document.querySelector('#product-name').value = product.name;
    document.querySelector('#product-price').value = product.price;
    document.querySelector('#product-description').value = product.description;
    
    // Show form
    document.querySelector('#product-form-container').style.display = 'block';
    
    // Scroll to form
    document.querySelector('#product-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Save product (add or update)
function saveProduct(form) {
    // Get form data
    const productId = form.querySelector('#product-id').value;
    const productName = form.querySelector('#product-name').value;
    const productPrice = parseFloat(form.querySelector('#product-price').value);
    const productDescription = form.querySelector('#product-description').value;
    const productImage = form.querySelector('#product-image').files[0];
    
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Check if we're updating an existing product
    if (productId) {
        // Find product index
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex > -1) {
            // Update product
            products[productIndex] = {
                ...products[productIndex],
                name: productName,
                price: productPrice,
                description: productDescription
            };
            
            // Handle image upload (in a real app, you'd upload to server)
            if (productImage) {
                // For demo, we'll just use a placeholder image
                products[productIndex].image = 'images/product-placeholder.jpg';
            }
        }
    } else {
        // Generate new product ID
        const newProductId = 'product_' + Date.now();
        
        // Add new product
        products.push({
            id: newProductId,
            name: productName,
            price: productPrice,
            description: productDescription,
            image: productImage ? 'images/product-placeholder.jpg' : 'images/product-placeholder.jpg'
        });
    }
    
    // Save products to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reload products
    loadAdminProducts();
    
    // Reset form
    form.reset();
    document.querySelector('#product-id').value = '';
    
    // Hide form
    document.querySelector('#product-form-container').style.display = 'none';
    
    // Show success notification
    showNotification('Product saved successfully');
}

// Delete product
function deleteProduct(productId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Remove product by ID
    products = products.filter(p => p.id !== productId);
    
    // Save products to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reload products
    loadAdminProducts();
    
    // Show success notification
    showNotification('Product deleted successfully');
}

// Delete user
function deleteUser(userId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Remove user by ID
    users = users.filter(u => u.id !== userId);
    
    // Save users to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reload users
    loadAdminUsers();
    
    // Show success notification
    showNotification('User deleted successfully');
}
