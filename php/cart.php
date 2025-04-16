
<?php
// Include database configuration
require_once 'config.php';

// Function to get cart items for a user
function getCartItems($userId) {
    global $conn;
    
    $userId = sanitize($userId);
    
    $query = "SELECT c.id, c.user_id, c.product_id, c.quantity, p.name, p.price, p.image FROM cart c 
              JOIN products p ON c.product_id = p.id 
              WHERE c.user_id = '$userId'";
              
    $result = mysqli_query($conn, $query);
    
    $cartItems = array();
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $cartItems[] = $row;
        }
    }
    
    return $cartItems;
}

// Function to add item to cart
function addToCart($userId, $productId, $quantity = 1) {
    global $conn;
    
    $userId = sanitize($userId);
    $productId = sanitize($productId);
    $quantity = sanitize($quantity);
    
    // Check if product exists
    $query = "SELECT * FROM products WHERE id = '$productId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) == 0) {
        return array("success" => false, "message" => "Product not found");
    }
    
    // Check if item already exists in cart
    $query = "SELECT * FROM cart WHERE user_id = '$userId' AND product_id = '$productId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        // Update quantity
        $row = mysqli_fetch_assoc($result);
        $newQuantity = $row['quantity'] + $quantity;
        
        $query = "UPDATE cart SET quantity = '$newQuantity' WHERE id = '{$row['id']}'";
        
        if (mysqli_query($conn, $query)) {
            return array("success" => true, "message" => "Cart updated successfully");
        } else {
            return array("success" => false, "message" => "Failed to update cart");
        }
    } else {
        // Add new item to cart
        $query = "INSERT INTO cart (user_id, product_id, quantity) VALUES ('$userId', '$productId', '$quantity')";
        
        if (mysqli_query($conn, $query)) {
            return array("success" => true, "message" => "Item added to cart successfully");
        } else {
            return array("success" => false, "message" => "Failed to add item to cart");
        }
    }
}

// Function to update cart item quantity
function updateCartItemQuantity($cartId, $quantity) {
    global $conn;
    
    $cartId = sanitize($cartId);
    $quantity = sanitize($quantity);
    
    // Check if cart item exists
    $query = "SELECT * FROM cart WHERE id = '$cartId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) == 0) {
        return array("success" => false, "message" => "Cart item not found");
    }
    
    // Update quantity
    $query = "UPDATE cart SET quantity = '$quantity' WHERE id = '$cartId'";
    
    if (mysqli_query($conn, $query)) {
        return array("success" => true, "message" => "Cart updated successfully");
    } else {
        return array("success" => false, "message" => "Failed to update cart");
    }
}

// Function to remove item from cart
function removeFromCart($cartId) {
    global $conn;
    
    $cartId = sanitize($cartId);
    
    // Check if cart item exists
    $query = "SELECT * FROM cart WHERE id = '$cartId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) == 0) {
        return array("success" => false, "message" => "Cart item not found");
    }
    
    // Delete cart item
    $query = "DELETE FROM cart WHERE id = '$cartId'";
    
    if (mysqli_query($conn, $query)) {
        return array("success" => true, "message" => "Item removed from cart successfully");
    } else {
        return array("success" => false, "message" => "Failed to remove item from cart");
    }
}

// Function to clear cart
function clearCart($userId) {
    global $conn;
    
    $userId = sanitize($userId);
    
    $query = "DELETE FROM cart WHERE user_id = '$userId'";
    
    if (mysqli_query($conn, $query)) {
        return array("success" => true, "message" => "Cart cleared successfully");
    } else {
        return array("success" => false, "message" => "Failed to clear cart");
    }
}

// Handle API requests
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Check if user is logged in
    if (!isLoggedIn()) {
        echo json_encode(array("success" => false, "message" => "Not logged in"));
        exit();
    }
    
    // Get cart items
    $cartItems = getCartItems($_SESSION['user_id']);
    echo json_encode($cartItems);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if user is logged in
    if (!isLoggedIn()) {
        echo json_encode(array("success" => false, "message" => "Not logged in"));
        exit();
    }
    
    // Add to cart
    if (isset($_POST['action']) && $_POST['action'] === 'add_to_cart') {
        $productId = $_POST['product_id'];
        $quantity = isset($_POST['quantity']) ? $_POST['quantity'] : 1;
        
        $result = addToCart($_SESSION['user_id'], $productId, $quantity);
        echo json_encode($result);
    }
    
    // Update cart item quantity
    if (isset($_POST['action']) && $_POST['action'] === 'update_quantity') {
        $cartId = $_POST['cart_id'];
        $quantity = $_POST['quantity'];
        
        $result = updateCartItemQuantity($cartId, $quantity);
        echo json_encode($result);
    }
    
    // Remove from cart
    if (isset($_POST['action']) && $_POST['action'] === 'remove_from_cart') {
        $cartId = $_POST['cart_id'];
        
        $result = removeFromCart($cartId);
        echo json_encode($result);
    }
    
    // Clear cart
    if (isset($_POST['action']) && $_POST['action'] === 'clear_cart') {
        $result = clearCart($_SESSION['user_id']);
        echo json_encode($result);
    }
}
?>
