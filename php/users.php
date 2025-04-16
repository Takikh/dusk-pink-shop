
<?php
// Include database configuration
require_once 'config.php';

// Function to get all users
function getAllUsers() {
    global $conn;
    
    // Check if user is admin
    if (!isAdmin()) {
        return array("success" => false, "message" => "Unauthorized");
    }
    
    $query = "SELECT id, username, email, role, profile_picture FROM users ORDER BY id DESC";
    $result = mysqli_query($conn, $query);
    
    $users = array();
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $users[] = $row;
        }
    }
    
    return $users;
}

// Function to delete a user
function deleteUser($userId) {
    global $conn;
    
    // Check if user is admin
    if (!isAdmin()) {
        return array("success" => false, "message" => "Unauthorized");
    }
    
    $userId = sanitize($userId);
    
    // Cannot delete admin users
    $query = "SELECT role FROM users WHERE id = '$userId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        
        if ($user['role'] === 'admin') {
            return array("success" => false, "message" => "Cannot delete admin user");
        }
    }
    
    $query = "DELETE FROM users WHERE id = '$userId'";
    
    if (mysqli_query($conn, $query)) {
        return array("success" => true, "message" => "User deleted successfully");
    }
    
    return array("success" => false, "message" => "Failed to delete user");
}

// Function to update user profile
function updateProfile($userId, $username, $email, $profilePicture = null) {
    global $conn;
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        return array("success" => false, "message" => "Unauthorized");
    }
    
    // Check if user is updating their own profile or is admin
    if ($_SESSION['user_id'] != $userId && !isAdmin()) {
        return array("success" => false, "message" => "Unauthorized");
    }
    
    $userId = sanitize($userId);
    $username = sanitize($username);
    $email = sanitize($email);
    
    // Check if username already exists
    $query = "SELECT * FROM users WHERE username = '$username' AND id != '$userId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        return array("success" => false, "message" => "Username already exists");
    }
    
    // Check if email already exists
    $query = "SELECT * FROM users WHERE email = '$email' AND id != '$userId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        return array("success" => false, "message" => "Email already exists");
    }
    
    $query = "UPDATE users SET username = '$username', email = '$email'";
    
    if ($profilePicture !== null) {
        $profilePicture = sanitize($profilePicture);
        $query .= ", profile_picture = '$profilePicture'";
    }
    
    $query .= " WHERE id = '$userId'";
    
    if (mysqli_query($conn, $query)) {
        // Update session variables if user is updating their own profile
        if ($_SESSION['user_id'] == $userId) {
            $_SESSION['username'] = $username;
        }
        
        return array("success" => true, "message" => "Profile updated successfully");
    }
    
    return array("success" => false, "message" => "Failed to update profile");
}

// Function to upload profile picture
function uploadProfilePicture($file) {
    $targetDir = "../images/profiles/";
    
    // Create directory if it doesn't exist
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    
    $fileName = basename($file["name"]);
    $targetFile = $targetDir . $fileName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    
    // Check if image file is a actual image or fake image
    $check = getimagesize($file["tmp_name"]);
    if ($check === false) {
        return "File is not an image.";
    }
    
    // Check file size (2MB max)
    if ($file["size"] > 2000000) {
        return "Sorry, your file is too large.";
    }
    
    // Allow certain file formats
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        return "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    }
    
    // Generate unique file name
    $newFileName = uniqid() . "." . $imageFileType;
    $targetFile = $targetDir . $newFileName;
    
    // Try to upload file
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return "images/profiles/" . $newFileName;
    } else {
        return "Sorry, there was an error uploading your file.";
    }
}

// Handle API requests
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get all users
    if (!isset($_GET['action'])) {
        $users = getAllUsers();
        echo json_encode($users);
    }
    
    // Get current user profile
    if (isset($_GET['action']) && $_GET['action'] === 'profile') {
        if (isLoggedIn()) {
            $user = getUserData($_SESSION['user_id']);
            echo json_encode($user);
        } else {
            echo json_encode(array("success" => false, "message" => "Not logged in"));
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Update profile
    if (isset($_POST['action']) && $_POST['action'] === 'update_profile') {
        $userId = $_POST['id'];
        $username = $_POST['username'];
        $email = $_POST['email'];
        
        $profilePicture = null;
        
        // Upload profile picture if provided
        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
            $uploadResult = uploadProfilePicture($_FILES['profile_picture']);
            
            if (strpos($uploadResult, "images/") === 0) {
                $profilePicture = $uploadResult;
            }
        }
        
        $result = updateProfile($userId, $username, $email, $profilePicture);
        echo json_encode($result);
    }
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    // Delete user
    parse_str(file_get_contents("php://input"), $deleteParams);
    
    if (isset($deleteParams['id'])) {
        $userId = $deleteParams['id'];
        
        $result = deleteUser($userId);
        echo json_encode($result);
    } else {
        echo json_encode(array("success" => false, "message" => "User ID is required"));
    }
}
?>
