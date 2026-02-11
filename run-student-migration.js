const pool = require('./config/database');

async function runMigration() {
  try {
    console.log('Running migration...');
    
    // Check if columns already exist to avoid errors
    const [columns] = await pool.execute('SHOW COLUMNS FROM admin_users');
    const hasEmployeeRecordId = columns.some(col => col.Field === 'employee_record_id');
    
    if (!hasEmployeeRecordId) {
      await pool.execute("ALTER TABLE admin_users MODIFY COLUMN role ENUM('super_admin', 'admin', 'student') DEFAULT 'student'");
      await pool.execute("ALTER TABLE admin_users ADD COLUMN employee_record_id INT NULL");
      await pool.execute("ALTER TABLE admin_users ADD CONSTRAINT fk_admin_users_employee FOREIGN KEY (employee_record_id) REFERENCES employees(id) ON DELETE SET NULL");
      console.log('Migration completed successfully.');
    } else {
      console.log('Migration already applied.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
