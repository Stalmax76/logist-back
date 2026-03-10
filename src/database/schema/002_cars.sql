CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'bus',
    capacity INT NOT NULL DEFAULT 3500,
    status ENUM('available', 'on_route', 'repair') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;