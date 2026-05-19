-- ============================================================
-- DATABASE: elzata_caffe
-- POS (Point of Sale) Elzata Coffee
-- ============================================================

CREATE DATABASE IF NOT EXISTS elzata_caffe 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE elzata_caffe;

-- ============================================================
-- TABEL: products (Manajemen Produk)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  category    VARCHAR(50)  NOT NULL,
  price       INT          NOT NULL DEFAULT 0,
  stock       INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL: transactions (Header Transaksi)
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  type          ENUM('sale', 'purchase') NOT NULL,
  customer_name VARCHAR(100) NULL,
  supplier      VARCHAR(100) NULL,
  total         INT          NOT NULL DEFAULT 0,
  date          DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL: transaction_items (Detail Item Transaksi)
-- ============================================================
CREATE TABLE IF NOT EXISTS transaction_items (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id  INT          NOT NULL,
  product_id      INT          NULL,
  product_name    VARCHAR(100) NOT NULL,
  quantity        INT          NOT NULL,
  price           INT          NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id)     REFERENCES products(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATA AWAL: Produk Default Elzata Coffee
-- ============================================================
INSERT INTO products (name, category, price, stock) VALUES
  ('Espresso',               'Coffee',  18000, 100),
  ('Americano',              'Coffee',  20000, 100),
  ('Cappuccino',             'Coffee',  25000, 100),
  ('Latte',                  'Coffee',  25000, 100),
  ('Mocaccino',              'Coffee',  28000, 100),
  ('Affogato',               'Coffee',  30000, 50),
  ('Elzata Signature',       'Coffee',  32000, 80),
  ('Kopi Susu Gula Aren',    'Coffee',  22000, 90),
  ('Croissant',              'Food',    22000, 30),
  ('Sandwich',               'Food',    35000, 25),
  ('Cheesecake',             'Dessert', 32000, 20),
  ('Brownies',               'Dessert', 18000, 40)
ON DUPLICATE KEY UPDATE name = name;
