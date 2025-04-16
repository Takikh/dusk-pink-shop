
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS responsive_commerce_hub;

USE responsive_commerce_hub;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    profile_picture VARCHAR(255) DEFAULT 'images/profile-placeholder.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    image VARCHAR(255) DEFAULT 'images/product-placeholder.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', 'admin', 'admin');

-- Insert default client user
INSERT INTO users (username, email, password, role) VALUES
('taki', 'taki@example.com', 'taki', 'client');

-- Insert sample products
INSERT INTO products (name, description, price, image) VALUES
('Smartphone Pro X', 'Un smartphone puissant avec un écran AMOLED de 6.5 pouces et une batterie longue durée.', 80000, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
('Casque audio sans fil', 'Casque audio Bluetooth avec réduction de bruit active et une autonomie de 30 heures.', 15000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
('Montre connectée Sport', 'Montre connectée avec GPS, suivi de la fréquence cardiaque et étanche jusqu\'à 50m.', 22000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
('Ordinateur portable Pro', 'Ordinateur portable léger et puissant avec processeur i7, 16GB de RAM et 512GB SSD.', 120000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
('Enceinte Bluetooth portable', 'Enceinte Bluetooth waterproof avec un son puissant et une autonomie de 12 heures.', 8000, 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
('Tablette tactile', 'Tablette tactile avec écran 10.2 pouces, 64GB de stockage et compatible avec stylet.', 50000, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60');
