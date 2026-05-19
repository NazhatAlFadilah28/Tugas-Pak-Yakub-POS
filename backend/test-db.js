const db = require('./db');

async function test() {
  try {
    const [rows] = await db.query('SELECT * FROM products LIMIT 1');
    console.log('✅ Database OK. Produk pertama:', rows[0] ? rows[0].name : 'Kosong');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    process.exit(1);
  }
}

test();
