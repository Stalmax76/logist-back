INSERT INTO driver_schedules 
(driver_id, date, type, planned_hours, shift_start_time, shift_end_time, actual_hours, overtime_hours, break_minutes, route_count, is_auto_generated, notes, status, created_by, updated_by, is_active, source)
VALUES
-- DRIVER 1 (ID = 3)
(3, '2025-03-15', 'work', 8, '2025-03-15 08:00:00', '2025-03-15 16:30:00', 8.5, 0.5, 30, 3, FALSE, 'Regular shift', 'confirmed', 1, 1, TRUE, 'manual'),
(3, '2025-03-16', 'day_off', 0, NULL, NULL, 0, 0, 0, 0, FALSE, 'Weekend', 'confirmed', 1, 1, TRUE, 'manual'),
(3, '2025-03-17', 'sick_leave', 0, NULL, NULL, 0, 0, 0, 0, FALSE, 'Sick leave', 'planned', 1, 1, TRUE, 'manual'),

-- DRIVER 2 (ID = 4)
(4, '2025-03-15', 'work', 10, '2025-03-15 07:00:00', '2025-03-15 19:00:00', 11, 1, 60, 4, TRUE, 'Long shift', 'confirmed', 1, 1, TRUE, 'auto'),
(4, '2025-03-16', 'vacation', 0, NULL, NULL, 0, 0, 0, 0, FALSE, 'Vacation day', 'confirmed', 1, 1, TRUE, 'manual'),

-- DRIVER 3 (ID = 5)
(5, '2025-03-15', 'work', 8, '2025-03-15 09:00:00', '2025-03-15 17:00:00', 0, 0, 0, 0, FALSE, 'Cancelled shift', 'cancelled', 1, 1, TRUE, 'manual'),
(5, '2025-03-16', 'work', 8, NULL, NULL, 0, 0, 0, 0, TRUE, 'Auto-generated schedule', 'planned', 1, 1, TRUE, 'auto');
