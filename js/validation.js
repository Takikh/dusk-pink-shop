
// Form validation functions

// Validate Login Form
function validateLoginForm(form) {
    const username = form.querySelector('input[name="username"]');
    const password = form.querySelector('input[name="password"]');
    let isValid = true;
    
    // Validate username
    if (!username.value.trim()) {
        showError(username, 'Username is required');
        isValid = false;
    } else {
        removeError(username);
    }
    
    // Validate password
    if (!password.value.trim()) {
        showError(password, 'Password is required');
        isValid = false;
    } else {
        removeError(password);
    }
    
    return isValid;
}

// Validate Signup Form
function validateSignupForm(form) {
    const username = form.querySelector('input[name="username"]');
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');
    const confirmPassword = form.querySelector('input[name="confirmPassword"]');
    let isValid = true;
    
    // Validate username
    if (!username.value.trim()) {
        showError(username, 'Username is required');
        isValid = false;
    } else if (username.value.length < 3) {
        showError(username, 'Username must be at least 3 characters');
        isValid = false;
    } else {
        removeError(username);
    }
    
    // Validate email
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        removeError(email);
    }
    
    // Validate password
    if (!password.value.trim()) {
        showError(password, 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters');
        isValid = false;
    } else {
        removeError(password);
    }
    
    // Validate confirm password
    if (confirmPassword.value !== password.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
    } else {
        removeError(confirmPassword);
    }
    
    return isValid;
}

// Validate Forgot Password Form
function validateForgotPasswordForm(form) {
    const email = form.querySelector('input[name="email"]');
    let isValid = true;
    
    // Validate email
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        removeError(email);
    }
    
    return isValid;
}

// Validate Product Form
function validateProductForm(form) {
    const name = form.querySelector('input[name="name"]');
    const price = form.querySelector('input[name="price"]');
    const description = form.querySelector('textarea[name="description"]');
    let isValid = true;
    
    // Validate name
    if (!name.value.trim()) {
        showError(name, 'Product name is required');
        isValid = false;
    } else {
        removeError(name);
    }
    
    // Validate price
    if (!price.value.trim()) {
        showError(price, 'Price is required');
        isValid = false;
    } else if (isNaN(parseFloat(price.value)) || parseFloat(price.value) <= 0) {
        showError(price, 'Please enter a valid price');
        isValid = false;
    } else {
        removeError(price);
    }
    
    // Validate description
    if (!description.value.trim()) {
        showError(description, 'Description is required');
        isValid = false;
    } else {
        removeError(description);
    }
    
    return isValid;
}

// Helper function to show error message
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }
    
    input.classList.add('is-invalid');
}

// Helper function to remove error message
function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    input.classList.remove('is-invalid');
}

// Helper function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
