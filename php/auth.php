
<?php
// Include database configuration
require_once 'config.php';

// Login function
function login($username, $password) {
    global $conn;
    
    $username = sanitize($username);
    
    // In a real application, passwords would be hashed
    // For demo purposes, we're using plain text passwords
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        
        // In a real application, you would verify the hashed password
        if ($password === $user['password']) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['user_role'] = $user['role'];
            
            return true;
        }
    }
    
    return false;
}

// Signup function
function signup($username, $email, $password) {
    global $conn;
    
    $username = sanitize($username);
    $email = sanitize($email);
    
    // Check if username already exists
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        return "Username already exists";
    }
    
    // Check if email already exists
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        return "Email already exists";
    }
    
    // In a real application, passwords would be hashed
    // For demo purposes, we're using plain text passwords
    
    // Insert new user
    $query = "INSERT INTO users (username, email, password, role, profile_picture) VALUES ('$username', '$email', '$password', 'client', 'images/profile-placeholder.jpg')";
    
    if (mysqli_query($conn, $query)) {
        return true;
    }
    
    return "Registration failed";
}

// Logout function
function logout() {
    // Unset all session variables
    $_SESSION = array();
    
    // Destroy the session
    session_destroy();
    
    // Redirect to login page
    header("Location: ../login.html");
    exit();
}

// Reset password function
function resetPassword($email) {
    global $conn;
    
    $email = sanitize($email);
    
    // Check if email exists
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        // In a real application, you would generate a reset token
        // And send a reset link to the user's email
        
        // For demo purposes, we'll just return true
        return true;
    }
    
    return "Email not found";
}

// Handle form submissions
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Login form
    if (isset($_POST['action']) && $_POST['action'] === 'login') {
        $username = $_POST['username'];
        $password = $_POST['password'];
        
        $loginResult = login($username, $password);
        
        if ($loginResult === true) {
            // Redirect based on user role
            if ($_SESSION['user_role'] === 'admin') {
                header("Location: ../admin.html");
            } else {
                header("Location: ../user.html");
            }
            exit();
        } else {
            // Redirect back to login page with error
            header("Location: ../login.html?error=invalid_credentials");
            exit();
        }
    }
    
    // Signup form
    if (isset($_POST['action']) && $_POST['action'] === 'signup') {
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        
        $signupResult = signup($username, $email, $password);
        
        if ($signupResult === true) {
            // Redirect to login page with success message
            header("Location: ../login.html?success=registration_complete");
            exit();
        } else {
            // Redirect back to signup page with error
            header("Location: ../signup.html?error=" . urlencode($signupResult));
            exit();
        }
    }
    
    // Reset password form
    if (isset($_POST['action']) && $_POST['action'] === 'reset_password') {
        $email = $_POST['email'];
        
        $resetResult = resetPassword($email);
        
        if ($resetResult === true) {
            // Redirect to login page with success message
            header("Location: ../login.html?success=password_reset_sent");
            exit();
        } else {
            // Redirect back to forgot password page with error
            header("Location: ../forgot-password.html?error=" . urlencode($resetResult));
            exit();
        }
    }
}

// Logout request
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    logout();
}
?>
