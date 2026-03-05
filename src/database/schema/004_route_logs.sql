-- Create route_logs table
CREATE TABLE IF NOT EXISTS route_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  user_id INT NOT NULL,

  -- технфчний час
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL,

  -- фактичні години (водій заповнює дані)
  actual_hours DECIMAL(5, 2) NULL COMMENT 'hours entered manually by the driver',

  -- статус виконання маршруту (водій заповнює дані логіст чи адміністратор підтверджує дані)
  status ENUM('draft', 'submitted', 'approved', 'cancelled', 'delayed') DEFAULT 'draft' COMMENT 'status of the route execution',

  -- фактичні дані
  distance_traveled DECIMAL(10, 2) NULL COMMENT 'in kilometers',
  fuel_used DECIMAL(10, 2) NULL COMMENT 'in liters',
  notes TEXT NULL,

  -- дата створення
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- звязки
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  -- індекси
  INDEX idx_route_id (route_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
