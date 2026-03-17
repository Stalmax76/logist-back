INSERT INTO routes 
(date, car_id, driver_id, start_location, end_location, route_number, planned_km, planned_hours, status)
VALUES
-- 1. Запланований маршрут
('2025-03-01', 2, 5, 'Warszawa', 'Kraków', 'A-102', 300, 4.00, 'planned'),

-- 2. Маршрут у процесі виконання
('2025-03-02', 2, 5, 'Kraków', 'Katowice', 'A-103', 90, 1.50, 'in_progress'),

-- 3. Завершений маршрут
('2025-03-03', 3, 5, 'Katowice', 'Wrocław', 'A-104', 200, 3.00, 'completed'),

-- 4. Затверджений маршрут
('2025-03-04', 3, 5, 'Wrocław', 'Poznań', 'A-105', 180, 2.50, 'approved'),

-- 5. Скасований маршрут
('2025-03-05', 2, 5, 'Poznań', 'Łódź', 'A-106', 210, 3.20, 'cancelled'),

-- 6. Видалений маршрут (soft delete)
('2025-03-06', 2, 5, 'Łódź', 'Warszawa', 'A-107', 130, 2.00, 'deleted'),

-- 7. Інший водій (для перевірки фільтрації)
('2025-03-01', 3, 7, 'Warszawa', 'Gdańsk', 'B-201', 340, 4.50, 'planned'),

-- 8. Інше авто (для перевірки фільтрації)
('2025-03-02', 4, 7, 'Gdańsk', 'Sopot', 'B-202', 15, 0.50, 'completed');
