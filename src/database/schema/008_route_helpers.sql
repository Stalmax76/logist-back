CREATE TABLE route_helpers (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    route_id INT UNSIGNED NOT NULL,
    helper_id INT UNSIGNED NOT NULL,
    
    CONSTRAINT fk_route
        FOREIGN KEY (route_id) REFERENCES routes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_helper
        FOREIGN KEY (helper_id) REFERENCES helpers(id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_route_helper (route_id, helper_id),
    INDEX idx_route_id (route_id),
    INDEX idx_helper_id (helper_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
