const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products - Ambil semua produk
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY category, name');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id - Ambil satu produk
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products - Tambah produk baru
router.post('/', async (req, res) => {
  const { name, category, price, stock } = req.body;
  if (!name || !category || !price)
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)',
      [name, category, parseInt(price), parseInt(stock) || 0]
    );
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0], message: 'Produk berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id - Update produk
router.put('/:id', async (req, res) => {
  const { name, category, price, stock } = req.body;
  if (!name || !category || !price)
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  try {
    await db.query(
      'UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?',
      [name, category, parseInt(price), parseInt(stock) || 0, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0], message: 'Produk berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id - Hapus produk
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
