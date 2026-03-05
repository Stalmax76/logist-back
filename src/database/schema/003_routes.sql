CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    car_id INT NOT NULL,
    driver_id INT NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    route_number VARCHAR(50) NOT NULL,
    planned_km INT DEFAULT 0,
    planned_hours DECIMAL(5,2) DEFAULT 0,
    status ENUM('planned', 'in_progress', 'completed',  'cancelled') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;