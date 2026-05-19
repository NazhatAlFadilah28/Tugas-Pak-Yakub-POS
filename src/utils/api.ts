// ============================================================
// API Service – menghubungkan frontend ke backend Elzata Coffee
// Base URL: http://localhost:5000/api
// ============================================================

const BASE_URL = 'http://localhost:8080/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan pada server');
  }
  return json;
}

// ── Products ──────────────────────────────────────────────
export const getProducts = () =>
  request<{ success: boolean; data: Product[] }>('/products');

export const createProduct = (data: Omit<Product, 'id'>) =>
  request<{ success: boolean; data: Product; message: string }>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateProduct = (id: number, data: Omit<Product, 'id'>) =>
  request<{ success: boolean; data: Product; message: string }>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteProduct = (id: number) =>
  request<{ success: boolean; message: string }>(`/products/${id}`, {
    method: 'DELETE',
  });

// ── Transactions ──────────────────────────────────────────
export const getTransactions = () =>
  request<{ success: boolean; data: Transaction[] }>('/transactions');

export const getSummary = () =>
  request<{ success: boolean; data: Summary }>('/transactions/summary');

export const createSale = (payload: SalePayload) =>
  request<{ success: boolean; message: string; transactionId: number }>(
    '/transactions/sale',
    { method: 'POST', body: JSON.stringify(payload) }
  );

export const createPurchase = (payload: PurchasePayload) =>
  request<{ success: boolean; message: string; transactionId: number }>(
    '/transactions/purchase',
    { method: 'POST', body: JSON.stringify(payload) }
  );

// ── Types ─────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface TransactionItem {
  id?: number;
  transaction_id?: number;
  product_id?: number;
  product_name?: string;
  productName?: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: number;
  type: 'sale' | 'purchase';
  customer_name?: string;
  supplier?: string;
  total: number;
  date: string;
  items: TransactionItem[];
}

export interface Summary {
  totalSales: number;
  salesCount: number;
  totalPurchases: number;
  purchaseCount: number;
  profit: number;
  totalTransactions: number;
}

export interface SalePayload {
  customerName: string;
  items: { id: number; name: string; price: number; quantity: number }[];
  total: number;
}

export interface PurchasePayload {
  supplier: string;
  items: { productId: number; productName: string; quantity: number; price: number }[];
  total: number;
}
