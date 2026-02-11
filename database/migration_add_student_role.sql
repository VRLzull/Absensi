-- Migration to add student role and link to employee
ALTER TABLE admin_users MODIFY COLUMN role ENUM('super_admin', 'admin', 'student') DEFAULT 'student';
ALTER TABLE admin_users ADD COLUMN employee_record_id INT NULL;
ALTER TABLE admin_users ADD CONSTRAINT fk_admin_users_employee FOREIGN KEY (employee_record_id) REFERENCES employees(id) ON DELETE SET NULL;
