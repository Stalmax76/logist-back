CREATE TABLE IF NOT EXISTS route_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    user_id INT NOT NULL,

    -- технічний час
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,

    -- фактичні години
    actual_hours DECIMAL(5, 2) NULL,

    -- статус виконання маршруту
    status ENUM(
        'draft',
        'submitted',
        'approved',
        'cancelled',
        'delayed',
        'deleted'
    ) DEFAULT 'draft',

    -- фактичні дані
    distance_traveled DECIMAL(10, 2) NULL,
    fuel_used DECIMAL(10, 2) NULL,
    notes TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_route_id (route_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
