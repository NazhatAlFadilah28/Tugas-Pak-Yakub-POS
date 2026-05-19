/**
 * setup-db.js
 * Jalankan sekali saja untuk membuat tabel dan data awal di database elzata_caffe
 * Cara: node setup-db.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function setup() {
  console.log('🔧 Memulai setup database elzata_caffe...\n');

  // Koneksi tanpa menentukan database dulu (untuk CREATE DATABASE)
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
  });

  try {
    // 1. Buat database
    await conn.query(`CREATE DATABASE IF NOT EXISTS elzata_caffe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Database elzata_caffe siap');

    await conn.query(`USE elzata_caffe`);

    // 2. Buat tabel products
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        category    VARCHAR(50)  NOT NULL,
        price       INT          NOT NULL DEFAULT 0,
        stock       INT          NOT NULL DEFAULT 0,
        created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Tabel products dibuat');

    // 3. Buat tabel transactions
    await conn.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        type          ENUM('sale', 'purchase') NOT NULL,
        customer_name VARCHAR(100) NULL,
        supplier      VARCHAR(100) NULL,
        total         INT          NOT NULL DEFAULT 0,
        date          DATETIME     DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Tabel transactions dibuat');

    // 4. Buat tabel transaction_items
    await conn.query(`
      CREATE TABLE IF NOT EXISTS transaction_items (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id  INT          NOT NULL,
        product_id      INT          NULL,
        product_name    VARCHAR(100) NOT NULL,
        quantity        INT          NOT NULL,
        price           INT          NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id)     REFERENCES products(id)     ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Tabel transaction_items dibuat');

    // 5. Cek apakah sudah ada data produk
    const [existing] = await conn.query(`SELECT COUNT(*) as cnt FROM products`);
    if (existing[0].cnt === 0) {
      await conn.query(`
        INSERT INTO products (name, category, price, stock) VALUES
          ('Espresso',            'Coffee',  18000, 100),
          ('Americano',           'Coffee',  20000, 100),
          ('Cappuccino',          'Coffee',  25000, 100),
          ('Latte',               'Coffee',  25000, 100),
          ('Mocaccino',           'Coffee',  28000, 100),
          ('Affogato',            'Coffee',  30000, 50),
          ('Elzata Signature',    'Coffee',  32000, 80),
          ('Kopi Susu Gula Aren', 'Coffee',  22000, 90),
          ('Croissant',           'Food',    22000, 30),
          ('Sandwich',            'Food',    35000, 25),
          ('Cheesecake',          'Dessert', 32000, 20),
          ('Brownies',            'Dessert', 18000, 40)
      `);
      console.log('✅ Data produk default berhasil dimasukkan (12 produk)');
    } else {
      console.log(`ℹ️  Tabel products sudah memiliki data (${existing[0].cnt} produk), skip insert`);
    }

    console.log('\n🎉 Setup selesai! Database elzata_caffe siap digunakan.');
    console.log('   Jalankan server dengan: node server.js\n');
  } catch (err) {
    console.error('\n❌ Error saat setup:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

setup();
