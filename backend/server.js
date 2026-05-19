require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const productsRouter    = require('./routes/products');
const transactionsRouter = require('./routes/transactions');

app.use('/api/products',     productsRouter);
app.use('/api/transactions', transactionsRouter);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
      <h1>🚀 Elzata Coffee API is Running!</h1>
      <p>Ini adalah server Backend (Data).</p>
      <div style="background: #f4f4f4; display: inline-block; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
        <p>Untuk melihat aplikasi Kasir, silakan buka:</p>
        <a href="http://localhost:3000" style="font-size: 20px; color: #2563eb; font-weight: bold; text-decoration: none;">http://localhost:3000</a>
      </div>
      <p style="margin-top: 20px; color: #666;">Status Database: <b>${process.env.DB_NAME}</b></p>
    </div>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Elzata Coffee POS API berjalan!',
    database: process.env.DB_NAME,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} tidak ditemukan` });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
