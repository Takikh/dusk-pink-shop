
<?php
// Include database configuration
require_once 'config.php';

// Function to get all products
function getAllProducts() {
    global $conn;
    
    $query = "SELECT * FROM products ORDER BY id DESC";
    $result = mysqli_query($conn, $query);
    
    $products = array();
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $products[] = $row;
        }
    }
    
    return $products;
}

// Function to get a single product
function getProduct($productId) {
    global $conn;
    
    $productId = sanitize($productId);
    
    $query = "SELECT * FROM products WHERE id = '$productId'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        return mysqli_fetch_assoc($result);
    }
    
    return null;
}

// Function to search products
function searchProducts($keyword, $minPrice = null, $maxPrice = null) {
    global $conn;
    
    $keyword = sanitize($keyword);
    
    $query = "SELECT * FROM products WHERE (name LIKE '%$keyword%' OR description LIKE '%$keyword%')";
    
    // Add price filter if provided
    if ($minPrice !== null && $maxPrice !== null) {
        $minPrice = sanitize($minPrice);
        $maxPrice = sanitize($maxPrice);
        
        $query .= " AND price BETWEEN '$minPrice' AND '$maxPrice'";
    } else if ($minPrice !== null) {
        $minPrice = sanitize($minPrice);
        
        $query .= " AND price >= '$minPrice'";
    } else if ($maxPrice !== null) {
        $maxPrice = sanitize($maxPrice);
        
        $query .= " AND price <= '$maxPrice'";
    }
    
    $query .= " ORDER BY id DESC";
    
    $result = mysqli_query($conn, $query);
    
    $products = array();
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $products[] = $row;
        }
    }
    
    return $products;
}

// Function to add a product
function addProduct($name, $description, $price, $image) {
    global $conn;
    
    $name = sanitize($name);
    $description = sanitize($description);
    $price = sanitize($price);
    $image = sanitize($image);
    
    $query = "INSERT INTO products (name, description, price, image) VALUES ('$name', '$description', '$price', '$image')";
    
    if (mysqli_query($conn, $query)) {
        return mysqli_insert_id($conn);
    }
    
    return false;
}

// Function to update a product
function updateProduct($productId, $name, $description, $price, $image = null) {
    global $conn;
    
    $productId = sanitize($productId);
    $name = sanitize($name);
    $description = sanitize($description);
    $price = sanitize($price);
    
    $query = "UPDATE products SET name = '$name', description = '$description', price = '$price'";
    
    if ($image !== null) {
        $image = sanitize($image);
        $query .= ", image = '$image'";
    }
    
    $query .= " WHERE id = '$productId'";
    
    return mysqli_query($conn, $query);
}

// Function to delete a product
function deleteProduct($productId) {
    global $conn;
    
    $productId = sanitize($productId);
    
    $query = "DELETE FROM products WHERE id = '$productId'";
    
    return mysqli_query($conn, $query);
}

// Function to upload product image
function uploadProductImage($file) {
    $targetDir = "../images/products/";
    
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
        return "images/products/" . $newFileName;
    } else {
        return "Sorry, there was an error uploading your file.";
    }
}

// Handle API requests
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get all products
    if (!isset($_GET['action'])) {
        $products = getAllProducts();
        echo json_encode($products);
    }
    
    // Get single product
    if (isset($_GET['action']) && $_GET['action'] === 'get_product' && isset($_GET['id'])) {
        $product = getProduct($_GET['id']);
        echo json_encode($product);
    }
    
    // Search products
    if (isset($_GET['action']) && $_GET['action'] === 'search') {
        $keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
        $minPrice = isset($_GET['min_price']) ? $_GET['min_price'] : null;
        $maxPrice = isset($_GET['max_price']) ? $_GET['max_price'] : null;
        
        $products = searchProducts($keyword, $minPrice, $maxPrice);
        echo json_encode($products);
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if user is admin
    if (!isAdmin()) {
        echo json_encode(array("success" => false, "message" => "Unauthorized"));
        exit();
    }
    
    // Add product
    if (isset($_POST['action']) && $_POST['action'] === 'add_product') {
        $name = $_POST['name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        
        $image = "images/product-placeholder.jpg"; // Default image
        
        // Upload image if provided
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadResult = uploadProductImage($_FILES['image']);
            
            if (strpos($uploadResult, "images/") === 0) {
                $image = $uploadResult;
            }
        }
        
        $result = addProduct($name, $description, $price, $image);
        
        if ($result) {
            echo json_encode(array("success" => true, "message" => "Product added successfully", "product_id" => $result));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to add product"));
        }
    }
    
    // Update product
    if (isset($_POST['action']) && $_POST['action'] === 'update_product') {
        $productId = $_POST['id'];
        $name = $_POST['name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        
        $image = null;
        
        // Upload image if provided
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadResult = uploadProductImage($_FILES['image']);
            
            if (strpos($uploadResult, "images/") === 0) {
                $image = $uploadResult;
            }
        }
        
        $result = updateProduct($productId, $name, $description, $price, $image);
        
        if ($result) {
            echo json_encode(array("success" => true, "message" => "Product updated successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update product"));
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    // Check if user is admin
    if (!isAdmin()) {
        echo json_encode(array("success" => false, "message" => "Unauthorized"));
        exit();
    }
    
    // Delete product
    parse_str(file_get_contents("php://input"), $deleteParams);
    
    if (isset($deleteParams['id'])) {
        $productId = $deleteParams['id'];
        
        $result = deleteProduct($productId);
        
        if ($result) {
            echo json_encode(array("success" => true, "message" => "Product deleted successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to delete product"));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "Product ID is required"));
    }
}
?>
