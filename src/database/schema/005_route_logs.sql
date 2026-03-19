CREATE TABLE IF NOT EXISTS route_logs (
    id INT UNSIGNED AUTO_INCREMENT  PRIMARY KEY,

    route_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED  NULL,
    user_role ENUM('driver', 'manager', 'admin') NOT NULL,

    action ENUM(
        'create',
        'update',
        'driver_update',
        'status_change',
        'manager_approval',
        'manager_rejection',
        'delete'
    ) NOT NULL,

    before_data JSON NULL,
    after_data JSON NULL,

    status_before ENUM(
        'planned',
        'in_progress', 
        'completed', 
        'pending_approval', 
        'approved', 
        'cancelled', 
        'deleted'
        ) NULL,

    status_after ENUM(
        'planned', 
        'in_progress', 
        'completed', 
        'pending_approval', 
        'approved', 
        'cancelled', 
        'deleted'
        ) NULL,

    comment TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_route_logs_route 
        FOREIGN KEY (route_id) REFERENCES routes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_route_logs_user 
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_route_id (route_id),
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
