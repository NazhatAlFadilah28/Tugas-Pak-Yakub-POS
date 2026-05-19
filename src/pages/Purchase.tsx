import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { getProducts, createPurchase, type Product } from '../utils/api';

interface PurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export default function Purchase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [supplier, setSupplier] = useState('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
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

  const addPurchaseItem = () => {
    if (!selectedProduct || quantity <= 0 || purchasePrice <= 0) {
      alert('Lengkapi semua data!');
      return;
    }
    const product = products.find(p => String(p.id) === selectedProduct);
    if (!product) return;

    // Cegah duplikat produk
    const exists = purchaseItems.find(i => i.productId === product.id);
    if (exists) {
      alert('Produk sudah ada di daftar. Hapus dan tambahkan kembali jika ingin mengubah.');
      return;
    }

    setPurchaseItems([...purchaseItems, {
      productId: product.id,
      productName: product.name,
      quantity,
      price: purchasePrice,
    }]);
    setSelectedProduct('');
    setQuantity(0);
    setPurchasePrice(0);
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const getTotalPurchase = () =>
    purchaseItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const completePurchase = async () => {
    if (purchaseItems.length === 0) { alert('Tidak ada item pembelian!'); return; }
    if (!supplier.trim()) { alert('Masukkan nama supplier!'); return; }

    try {
      setProcessing(true);
      const res = await createPurchase({
        supplier,
        items: purchaseItems,
        total: getTotalPurchase(),
      });
      alert(res.message);
      setPurchaseItems([]);
      setSupplier('');
      await fetchProducts(); // Refresh stok
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal memproses pembelian');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#6f4d3b] flex items-center gap-2">
          <Package className="w-8 h-8" />
          Pembelian Stok
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchProducts} className="ml-auto text-sm underline">Coba lagi</button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Purchase Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-[#e8d9c9] h-fit">
          <h2 className="text-xl font-bold text-[#6f4d3b] mb-4">Tambah Item Pembelian</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Nama Supplier</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Masukkan nama supplier"
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Pilih Produk</label>
              {loading ? (
                <div className="flex items-center gap-2 text-[#8a5d45] py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Memuat produk...</span>
                </div>
              ) : (
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stok: {product.stock})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Jumlah</label>
              <input
                type="number"
                value={quantity || ''}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="Masukkan jumlah"
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Harga Beli per Unit (Rp)</label>
              <input
                type="number"
                value={purchasePrice || ''}
                onChange={(e) => setPurchasePrice(parseInt(e.target.value) || 0)}
                placeholder="Masukkan harga beli"
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
                min="0"
              />
            </div>

            <button
              onClick={addPurchaseItem}
              className="w-full bg-[#8a5d45] text-white py-2 rounded-lg font-semibold hover:bg-[#6f4d3b] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tambah ke Daftar
            </button>
          </div>
        </div>

        {/* Purchase List */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-[#e8d9c9]">
          <h2 className="text-xl font-bold text-[#6f4d3b] mb-4">Daftar Pembelian</h2>

          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {purchaseItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada item pembelian</p>
            ) : (
              purchaseItems.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-[#faf7f4] to-[#f4ede5] p-4 rounded-lg border border-[#d9bfa4]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-[#6f4d3b]">{item.productName}</h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity} unit × Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <button
                      onClick={() => removePurchaseItem(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#8a5d45]">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#d9bfa4] pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-[#6f4d3b]">Total Pembelian:</span>
              <span className="text-2xl font-bold text-[#8a5d45]">
                Rp {getTotalPurchase().toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={completePurchase}
              disabled={purchaseItems.length === 0 || processing}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                purchaseItems.length === 0 || processing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#6f4d3b] to-[#8a5d45] text-white hover:shadow-lg'
              }`}
            >
              {processing && <Loader2 className="w-4 h-4 animate-spin" />}
              Proses Pembelian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
