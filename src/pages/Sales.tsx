import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { getProducts, createSale, type Product } from '../utils/api';

interface CartItem extends Product {
  quantity: number;
}

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts();
      setProducts(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          Number(item.id) === Number(product.id) ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        alert('Stok tidak cukup!');
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      } else {
        alert('Stok habis!');
      }
    }
  };

  const updateQuantity = (id: number, change: number) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      setCart(cart.filter(i => Number(i.id) !== Number(id)));
    } else if (newQuantity <= item.stock) {
      setCart(cart.map(i => Number(i.id) === Number(id) ? { ...i, quantity: newQuantity } : i));
    } else {
      alert('Stok tidak cukup!');
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => Number(item.id) !== Number(id)));
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const completeSale = async () => {
    if (cart.length === 0) { alert('Keranjang kosong!'); return; }
    if (!customerName.trim()) { alert('Masukkan nama pelanggan!'); return; }

    try {
      setProcessing(true);
      const res = await createSale({
        customerName,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getTotalPrice(),
      });
      alert(res.message);
      setCart([]);
      setCustomerName('');
      await fetchProducts(); // Refresh stok
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal memproses penjualan');
    } finally {
      setProcessing(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#6f4d3b] flex items-center gap-2">
          <ShoppingCart className="w-8 h-8" />
          Penjualan (POS)
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchProducts} className="ml-auto text-sm underline">Coba lagi</button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-[#e8d9c9]">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#8a5d45] text-white font-semibold'
                      : 'bg-[#f4ede5] text-[#6f4d3b] hover:bg-[#e8d9c9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 gap-3 text-[#8a5d45]">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Memuat produk...</span>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`bg-gradient-to-br from-[#faf7f4] to-[#f4ede5] p-4 rounded-lg border-2 text-left transition-all ${
                      product.stock === 0
                        ? 'border-gray-200 opacity-50 cursor-not-allowed'
                        : 'border-[#d9bfa4] hover:border-[#8a5d45] hover:shadow-md'
                    }`}
                  >
                    <h3 className="font-bold text-[#6f4d3b] mb-1">{product.name}</h3>
                    <p className="text-[#8a5d45] font-semibold">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                    <p className={`text-sm ${product.stock < 10 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      Stok: {product.stock}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-[#e8d9c9] sticky top-4">
            <h2 className="text-xl font-bold text-[#6f4d3b] mb-4">Keranjang</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">
                Nama Pelanggan
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama pelanggan"
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
              />
            </div>

            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Keranjang kosong</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-[#faf7f4] p-3 rounded-lg border border-[#e8d9c9]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#6f4d3b] text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="bg-[#8a5d45] text-white p-1 rounded hover:bg-[#6f4d3b]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-[#6f4d3b] w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="bg-[#8a5d45] text-white p-1 rounded hover:bg-[#6f4d3b]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-[#8a5d45]">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#d9bfa4] pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#6f4d3b]">Total:</span>
                <span className="text-2xl font-bold text-[#8a5d45]">
                  Rp {getTotalPrice().toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={completeSale}
                disabled={cart.length === 0 || processing}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  cart.length === 0 || processing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#6f4d3b] to-[#8a5d45] text-white hover:shadow-lg'
                }`}
              >
                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                Proses Penjualan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
