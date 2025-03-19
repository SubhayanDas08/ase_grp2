-- Create Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create RolePermissions Table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    domain VARCHAR(255) NOT NULL -- No UNIQUE constraint here
);

-- Create DomainAccess Table
CREATE TABLE IF NOT EXISTS domain_access (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    CONSTRAINT fk_domain_access_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Example Data
INSERT INTO roles (name) VALUES ('Garda'), ('TFI Administrator');

INSERT INTO permissions (name) VALUES ('view_events'), ('manage_events'), ('monitor_transport_congestion');

INSERT INTO role_permissions (role_id, permission_id)
VALUES 
    ((SELECT id FROM roles WHERE name = 'Garda'), (SELECT id FROM permissions WHERE name = 'view_events')),
    ((SELECT id FROM roles WHERE name = 'Garda'), (SELECT id FROM permissions WHERE name = 'manage_events')),
    ((SELECT id FROM roles WHERE name = 'TFI Administrator'), (SELECT id FROM permissions WHERE name = 'view_events')),
    ((SELECT id FROM roles WHERE name = 'TFI Administrator'), (SELECT id FROM permissions WHERE name = 'manage_events')),
    ((SELECT id FROM roles WHERE name = 'Garda'), (SELECT id FROM permissions WHERE name = 'monitor_transport_congestion'));

INSERT INTO users (first_name, last_name, email, phone_number, password, domain)
VALUES 
    ('John', 'Doe', 'john.doe@garda.ie', '1234567890', 'hashed_password', 'garda.ie'),
    ('Jane', 'Smith', 'jane.smith@tfi.ie', '0987654321', 'hashed_password', 'tfi.ie');

INSERT INTO domain_access (role_id, domain)
VALUES 
    ((SELECT id FROM roles WHERE name = 'Garda'), 'garda.ie'),
    ((SELECT id FROM roles WHERE name = 'TFI Administrator'), 'tfi.ie');

INSERT INTO events (name, start_date, end_date, created_by)
VALUES 
    ('Tech Conference', '2025-05-01 10:00:00', '2025-05-02 18:00:00', (SELECT id FROM users WHERE email = 'john.doe@garda.ie')),
    ('Workshop', '2025-06-15 09:00:00', '2025-06-15 17:00:00', (SELECT id FROM users WHERE email = 'jane.smith@tfi.ie'));
