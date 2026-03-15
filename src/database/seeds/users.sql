-- Clear table (optional)
-- TRUNCATE TABLE users;

-- pasword for all users is: Password123
-- bcrypt hash: $2b$10$uQx6e7iH730cdpShUMHbS.8ZH0zsP5NdQ4KJIp4jOSAmhpN6wX6l6
-- хеш для пароля: $2b$10$fkOCFus/OBsIrpsTFnlN/eJti4MXTMbOyfEmNaza0gM2xFTMCLIRC


-- згенерувати хеш
/*
import bcrypt from 'bcryptjs';

const password = 'Password123';
bcrypt.hash(password, 10).then(hash => console.log(hash));
*/

INSERT INTO users 
(first_name, last_name, phone, email, password_hash, role, is_active, created_at, updated_at, deleted_at, reset_token, reset_expires)
VALUES
-- ADMIN
('Vasyl', 'Adminenko', '+380501112233', 'admin@example.com',
'$2b$10$fkOCFus/OBsIrpsTFnlN/eJti4MXTMbOyfEmNaza0gM2xFTMCLIRC',
'admin', 1, NOW(), NOW(), NULL, NULL, NULL),

-- MANAGER
('Iryna', 'Managerova', '+380501234567', 'manager@example.com',
'$2b$10$fkOCFus/OBsIrpsTFnlN/eJti4MXTMbOyfEmNaza0gM2xFTMCLIRC',
'manager', 1, NOW(), NOW(), NULL, NULL, NULL),

-- DRIVER 1
('Petro', 'Vodiyenko', '+380501111111', 'driver1@example.com',
'$2b$10$fkOCFus/OBsIrpsTFnlN/eJti4MXTMbOyfEmNaza0gM2xFTMCLIRC',
'driver', 1, NOW(), NOW(), NULL, NULL, NULL),

-- DRIVER 2
('Oleh', 'Shoferskyi', '+380502222222', 'driver2@example.com',
'$2b$10$fkOCFus/OBsIrpsTFnlN/eJti4MXTMbOyfEmNaza0gM2xFTMCLIRC',
'driver', 1, NOW(), NOW(), NULL, NULL, NULL),

-- DRIVER 3
('Mykola', 'Kermanych', '+380503333333', 'driver3@example.com',
'$2b$10$fkOCFus/OBsIrpsTFnlN/eJti4MXTMbOyfEmNaza0gM2xFTMCLIRC',
'driver', 1, NOW(), NOW(), NULL, NULL, NULL),

-- DEACTIVATED DRIVER
('Taras', 'Zablokovanyi', '+380504444444', 'driver4@example.com',
'$2b$10$fkOCFus/OBsIrpsTFnlN/eJti4MXTMbOyfEmNaza0gM2xFTMCLIRC',
'driver', 0, NOW(), NOW(), NOW(), NULL, NULL);
