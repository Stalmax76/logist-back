CREATE TABLE driver_efficiency (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES users(id),
    period_from DATE NOT NULL,
    period_to DATE NOT NULL,
    efficiency_score INTEGER NOT NULL,
    on_time_percentage NUMERIC(5,2),
    overtime_percentage NUMERIC(5,2),
    avg_hours_per_route NUMERIC(6,2),
    avg_km_per_route NUMERIC(6,2),
    created_at TIMESTAMP DEFAULT NOW()
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;