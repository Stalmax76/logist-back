INSERT INTO route_logs (
    route_id,
    user_id,
    user_role,
    action,
    before_data,
    after_data,
    status_before,
    status_after,
    comment
) VALUES

-- 1. Маршрут 1 створено менеджером
(1, 2, 'manager', 'create',
 NULL,
 JSON_OBJECT('date', '2025-03-01', 'driver_id', 5, 'car_id', 2),
 NULL,
 'planned',
 'Створено маршрут менеджером'),

-- 2. Менеджер оновив маршрут 1 (зміна авто)
(1, 2, 'manager', 'update',
 JSON_OBJECT('car_id', 2),
 JSON_OBJECT('car_id', 1),
 'planned',
 'planned',
 'Менеджер змінив авто'),

-- 3. Водій оновив фактичні дані маршруту 1
(1, 5, 'driver', 'driver_update',
 JSON_OBJECT('actual_km', 0),
 JSON_OBJECT('actual_km', 12),
 'planned',
 'pending_approval',
 'Водій оновив фактичні дані'),

-- 4. Менеджер підтвердив зміни водія
(1, 2, 'manager', 'manager_approval',
 NULL,
 NULL,
 'pending_approval',
 'approved',
 'Менеджер підтвердив зміни'),

-- 5. Маршрут 2 перейшов у статус in_progress
(2, 5, 'driver', 'status_change',
 NULL,
 NULL,
 'planned',
 'in_progress',
 'Водій розпочав маршрут'),

-- 6. Маршрут 3 завершено
(3, 5, 'driver', 'status_change',
 NULL,
 NULL,
 'in_progress',
 'completed',
 'Маршрут завершено водієм'),

-- 7. Маршрут 4 затверджено менеджером
(4, 2, 'manager', 'manager_approval',
 NULL,
 NULL,
 'pending_approval',
 'approved',
 'Менеджер затвердив маршрут'),

-- 8. Маршрут 5 скасовано менеджером
(5, 2, 'manager', 'manager_rejection',
 NULL,
 NULL,
 'pending_approval',
 'cancelled',
 'Маршрут скасовано'),

-- 9. Маршрут 6 видалено адміністратором
(6, 1, 'admin', 'delete',
 NULL,
 NULL,
 'cancelled',
 'deleted',
 'Адмін видалив маршрут');
