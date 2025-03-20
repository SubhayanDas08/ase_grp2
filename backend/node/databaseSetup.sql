CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    domain VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS domain_access (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    CONSTRAINT fk_domain_access_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- Insert Roles
-- ================================

INSERT INTO roles (name) VALUES 
('City Manager'), 
('General Public'),
('Emergency Services'),
-- ('All Users'),
('Garda'),
('TFI Administrator'),
('Waste Managers'),
('System Admin');

-- ================================
-- Insert Permissions
-- ================================

INSERT INTO permissions (name) VALUES 
('check_transport_schedule'),
('monitor_transport_congestion'),
('view_weather_AQI'),
('view_events'),
('manage_events'),
('get_fleet_size_recommendation'),
('view_efficient_routes'),
('get_trash_pickup_recommendation'),
('modify_datasets'),
('add_new_datasets'),
('system_fault_management'),
('update_prediction_models');

-- ================================
-- Insert Role-Permissions Mapping
-- ================================

-- General Public
INSERT INTO role_permissions (role_id, permission_id)
VALUES 
((SELECT id FROM roles WHERE name = 'General Public'), (SELECT id FROM permissions WHERE name = 'check_transport_schedule')),
-- ((SELECT id FROM roles WHERE name = 'General Public'), (SELECT id FROM permissions WHERE name = 'monitor_transport_congestion')),
((SELECT id FROM roles WHERE name = 'General Public'), (SELECT id FROM permissions WHERE name = 'view_weather_AQI')),
((SELECT id FROM roles WHERE name = 'General Public'), (SELECT id FROM permissions WHERE name = 'view_events')),
((SELECT id FROM roles WHERE name = 'General Public'), (SELECT id FROM permissions WHERE name = 'view_efficient_routes'));


-- City Manager
INSERT INTO role_permissions (role_id, permission_id)
VALUES 
-- ((SELECT id FROM roles WHERE name = 'City Manager'), (SELECT id FROM permissions WHERE name = 'check_transport_schedule')),
((SELECT id FROM roles WHERE name = 'City Manager'), (SELECT id FROM permissions WHERE name = 'monitor_transport_congestion')),
((SELECT id FROM roles WHERE name = 'City Manager'), (SELECT id FROM permissions WHERE name = 'view_weather_AQI')),
((SELECT id FROM roles WHERE name = 'City Manager'), (SELECT id FROM permissions WHERE name = 'view_events')),
((SELECT id FROM roles WHERE name = 'City Manager'), (SELECT id FROM permissions WHERE name = 'manage_events')),
((SELECT id FROM roles WHERE name = 'City Manager'), (SELECT id FROM permissions WHERE name = 'get_fleet_size_recommendation')),
((SELECT id FROM roles WHERE name = 'City Manager'), (SELECT id FROM permissions WHERE name = 'view_efficient_routes'));

-- Emergency Services
INSERT INTO role_permissions (role_id, permission_id)
VALUES 
((SELECT id FROM roles WHERE name = 'Emergency Services'), (SELECT id FROM permissions WHERE name = 'view_weather_AQI')),
((SELECT id FROM roles WHERE name = 'Emergency Services'), (SELECT id FROM permissions WHERE name = 'view_events')),
((SELECT id FROM roles WHERE name = 'Emergency Services'), (SELECT id FROM permissions WHERE name = 'manage_events')),
((SELECT id FROM roles WHERE name = 'Emergency Services'), (SELECT id FROM permissions WHERE name = 'view_efficient_routes'));

-- -- All Users
-- INSERT INTO role_permissions (role_id, permission_id)
-- VALUES 
-- ((SELECT id FROM roles WHERE name = 'All Users'), (SELECT id FROM permissions WHERE name = 'check_transport_schedule')),
-- ((SELECT id FROM roles WHERE name = 'All Users'), (SELECT id FROM permissions WHERE name = 'monitor_transport_congestion')),
-- ((SELECT id FROM roles WHERE name = 'All Users'), (SELECT id FROM permissions WHERE name = 'view_weather_AQI')),
-- ((SELECT id FROM roles WHERE name = 'All Users'), (SELECT id FROM permissions WHERE name = 'view_events'));

-- Garda
INSERT INTO role_permissions (role_id, permission_id)
VALUES 
((SELECT id FROM roles WHERE name = 'Garda'), (SELECT id FROM permissions WHERE name = 'view_events')),
((SELECT id FROM roles WHERE name = 'Garda'), (SELECT id FROM permissions WHERE name = 'manage_events')),
((SELECT id FROM roles WHERE name = 'Garda'), (SELECT id FROM permissions WHERE name = 'monitor_transport_congestion')),
((SELECT id FROM roles WHERE name = 'Garda'), (SELECT id FROM permissions WHERE name = 'view_efficient_routes'));

-- TFI Administrator
INSERT INTO role_permissions (role_id, permission_id)
VALUES 
((SELECT id FROM roles WHERE name = 'TFI Administrator'), (SELECT id FROM permissions WHERE name = 'view_events')),
((SELECT id FROM roles WHERE name = 'TFI Administrator'), (SELECT id FROM permissions WHERE name = 'manage_events')),
((SELECT id FROM roles WHERE name = 'TFI Administrator'), (SELECT id FROM permissions WHERE name = 'get_fleet_size_recommendation')),
((SELECT id FROM roles WHERE name = 'TFI Administrator'), (SELECT id FROM permissions WHERE name = 'view_efficient_routes')),
((SELECT id FROM roles WHERE name = 'TFI Administrator'), (SELECT id FROM permissions WHERE name = 'monitor_transport_congestion'));


-- Waste Managers
INSERT INTO role_permissions (role_id, permission_id)
VALUES 
((SELECT id FROM roles WHERE name = 'Waste Managers'), (SELECT id FROM permissions WHERE name = 'get_trash_pickup_recommendation'));

-- System Admin
INSERT INTO role_permissions (role_id, permission_id)
VALUES 
((SELECT id FROM roles WHERE name = 'System Admin'), (SELECT id FROM permissions WHERE name = 'modify_datasets')),
((SELECT id FROM roles WHERE name = 'System Admin'), (SELECT id FROM permissions WHERE name = 'add_new_datasets')),
((SELECT id FROM roles WHERE name = 'System Admin'), (SELECT id FROM permissions WHERE name = 'system_fault_management')),
((SELECT id FROM roles WHERE name = 'System Admin'), (SELECT id FROM permissions WHERE name = 'update_prediction_models'));




INSERT INTO users (first_name, last_name, email, phone_number, password, domain)
VALUES 
    ('John', 'Doe', 'john.doe@garda.ie', '1234567890', 'hashed_password', 'garda.ie'),
    ('Jane', 'Smith', 'jane.smith@tfi.ie', '0987654321', 'hashed_password', 'tfi.ie'),
    ('Janedsa', 'ali', 'jane.smisadfath@gmail.com', '0987654321', 'hashed_password', 'gmail.com');
    ('Jack', 'Smith', 'jack.smith@hospital.ie', '02859394', 'hashed_password', 'hospital.ie');
    ('Jane', 'Doe', 'jane.doe@waste.ie', '18493758', 'hashed_password', 'waste.ie');
    ('Mary', 'John', 'mary.john@citymanangement.ie', '198394897', 'hashed_password', 'citymanangement.ie')
    ('Jack', 'Doe', 'jack.doe@systemadmin.ie', '2749720', 'hashed_password', 'systemadmin.ie')

INSERT INTO domain_access (role_id, domain)
VALUES 
    ((SELECT id FROM roles WHERE name = 'Garda'), 'garda.ie'),
    ((SELECT id FROM roles WHERE name = 'General Public'), 'gmail.com'),
    ((SELECT id FROM roles WHERE name = 'Emergency Services'), 'hospital.ie')
    ((SELECT id FROM roles WHERE name = 'System Admin'), 'systemadmin.ie'),
    ((SELECT id FROM roles WHERE name = 'TFI Administrator'), 'tfi.ie'),
    ((SELECT id FROM roles WHERE name = 'City Manager'), 'citymanangement.ie'),
    ((SELECT id FROM roles WHERE name = 'Waste Managers'), 'waste.ie');

INSERT INTO events (name, start_date, end_date, created_by)
VALUES 
    ('Tech Conference', '2025-05-01 10:00:00', '2025-05-02 18:00:00', (SELECT id FROM users WHERE email = 'john.doe@garda.ie')),
    ('Workshop', '2025-06-15 09:00:00', '2025-06-15 17:00:00', (SELECT id FROM users WHERE email = 'jane.smith@tfi.ie'));
