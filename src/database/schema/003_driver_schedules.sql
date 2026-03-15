CREATE TABLE IF NOT EXISTS driver_schedules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  driver_id INT  UNSIGNED NOT NULL,
  date DATE NOT NULL,

  /* type of schedule */
  type ENUM('work', 'vacation', 'day_off', 'sick_leave') DEFAULT 'work',

  /* how many hours planned */
  planned_hours DECIMAL(5, 2) DEFAULT 0,

  shift_start_time DATETIME NULL,
  shift_end_time DATETIME NULL,

  /* how many hours actually worked */
  actual_hours DECIMAL(5, 2) DEFAULT 0,

  /* overtime hours */
  overtime_hours DECIMAL(5, 2) DEFAULT 0,

  /* break duration in minutes */
  break_minutes INT DEFAULT 0,

  
  /* how many routes completed */
  route_count INT DEFAULT 0,

  /* auto generated or manual */
  is_auto_generated BOOLEAN DEFAULT TRUE,


  notes TEXT NULL,

   /* status of schedule */
  status ENUM('planned', 'confirmed', 'cancelled') DEFAULT 'planned',

 /* timestamps */
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

 /* audit */
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL,

  /* soft delete */
  is_active BOOLEAN DEFAULT TRUE,

   /* source of schedule */
 source ENUM('manual', 'auto', 'import', 'system') DEFAULT 'manual',


  /* foreign keys */
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id),

 /* indexes */
  INDEX idx_driver_id (driver_id),
  INDEX idx_date (date),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_driver_status (driver_id, status),


/* unique constraint */
  UNIQUE KEY unique_driver_date (driver_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
