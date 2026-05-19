const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'elzata_caffe',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test koneksi
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Berhasil terhubung ke database MySQL: elzata_caffe');
    conn.release();
  } catch (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
