const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',           // Laragon default user
  password: '',           // Laragon default (empty password)
  database: 'absensi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    // Don't exit process, just log error so app can try again later
  }
})();

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Attempting to reconnect to database...');
  }
});

module.exports = pool;
