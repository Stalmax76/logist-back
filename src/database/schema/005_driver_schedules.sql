CREATE TABLE IF NOT EXISTS driver_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  date DATE NOT NULL,

  -- тип дня
  type ENUM('work', 'vacation', 'day_off', 'sick_leave') DEFAULT 'work',

  -- планові години (логіст планує)
  planned_hours DECIMAL(5, 2) DEFAULT 0,

  -- фактичні години (автоматично з route_logs або вручну)
  actual_hours DECIMAL(5, 2) DEFAULT 0,

  -- автоматично створено чи вручну
  is_auto_generated BOOLEAN DEFAULT TRUE,

  notes TEXT NULL,

  -- статус плану
  status ENUM('planned', 'confirmed', 'cancelled') DEFAULT 'planned',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_driver_id (driver_id),
  INDEX idx_date (date),
  INDEX idx_type (type),
  INDEX idx_status (status),

  UNIQUE KEY unique_driver_date (driver_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
