const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, 'migration_add_feedback.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running migration...');
    await pool.query(sql);
    console.log('✅ Migration executed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
