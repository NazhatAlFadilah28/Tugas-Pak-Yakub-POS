const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/transactions - Ambil semua transaksi beserta items
router.get('/', async (req, res) => {
  try {
    const [transactions] = await db.query(
      'SELECT * FROM transactions ORDER BY date DESC'
    );

    // Ambil items untuk setiap transaksi
    const result = await Promise.all(
      transactions.map(async (trx) => {
        const [items] = await db.query(
          'SELECT * FROM transaction_items WHERE transaction_id = ?',
          [trx.id]
        );
        return { ...trx, items };
      })
    );

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/transactions/summary - Statistik ringkasan
router.get('/summary', async (req, res) => {
  try {
    const [[salesRow]] = await db.query(
      `SELECT COUNT(*) as count, IFNULL(SUM(total),0) as total 
       FROM transactions WHERE type='sale'`
    );
    const [[purchaseRow]] = await db.query(
      `SELECT COUNT(*) as count, IFNULL(SUM(total),0) as total 
       FROM transactions WHERE type='purchase'`
    );
    res.json({
      success: true,
      data: {
        totalSales: Number(salesRow.total),
        salesCount: Number(salesRow.count),
        totalPurchases: Number(purchaseRow.total),
        purchaseCount: Number(purchaseRow.count),
        profit: Number(salesRow.total) - Number(purchaseRow.total),
        totalTransactions: Number(salesRow.count) + Number(purchaseRow.count),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/transactions/sale - Proses penjualan
router.post('/sale', async (req, res) => {
  const { customerName, items, total } = req.body;

  if (!customerName || !items || items.length === 0)
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insert transaksi header
    const [trxResult] = await conn.query(
      'INSERT INTO transactions (type, customer_name, total, date) VALUES (?, ?, ?, NOW())',
      ['sale', customerName, total]
    );
    const transactionId = trxResult.insertId;

    // Insert items & kurangi stok
    for (const item of items) {
      await conn.query(
        'INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, price) VALUES (?,?,?,?,?)',
        [transactionId, item.id, item.name, item.quantity, item.price]
      );
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.id, item.quantity]
      );
    }

    await conn.commit();
    res.status(201).json({
      success: true,
      message: `Penjualan berhasil! Total: Rp ${total.toLocaleString('id-ID')}`,
      transactionId,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// POST /api/transactions/purchase - Proses pembelian stok
router.post('/purchase', async (req, res) => {
  const { supplier, items, total } = req.body;

  if (!supplier || !items || items.length === 0)
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insert transaksi header
    const [trxResult] = await conn.query(
      'INSERT INTO transactions (type, supplier, total, date) VALUES (?, ?, ?, NOW())',
      ['purchase', supplier, total]
    );
    const transactionId = trxResult.insertId;

    // Insert items & tambah stok
    for (const item of items) {
      await conn.query(
        'INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, price) VALUES (?,?,?,?,?)',
        [transactionId, item.productId, item.productName, item.quantity, item.price]
      );
      await conn.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    await conn.commit();
    res.status(201).json({
      success: true,
      message: `Pembelian berhasil dicatat! Total: Rp ${total.toLocaleString('id-ID')}`,
      transactionId,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
