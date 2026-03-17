CREATE TABLE IF NOT EXISTS routes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    car_id INT UNSIGNED NOT NULL,
    driver_id INT UNSIGNED NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    route_number VARCHAR(50) NOT NULL,

    planned_km DECIMAL(6,2) DEFAULT 0,
    planned_hours DECIMAL(5,2) DEFAULT 0,

    actual_km DECIMAL(6,2) DEFAULT 0 ,
    actual_hours DECIMAL(5,2) DEFAULT 0,

    helper_name VARCHAR(255) NULL DEFAULT NULL,
    notes TEXT NULL,

    -- статуси узгоджені з бекендом + soft delete
    status ENUM(
        'planned',
        'in_progress',
        'completed',
        'pending_approval',
        'approved',
        'cancelled',
        'deleted'
    ) DEFAULT 'planned',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE RESTRICT,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE RESTRICT,

    INDEX idx_car_id (car_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_status (status),
    INDEX idx_date (date),
    UNIQUE INDEX idx_route_number (route_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
