import { useState, useEffect } from 'react';
import { List, Plus, Edit2, Trash2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from '../utils/api';

type FormData = Omit<Product, 'id'>;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
  });

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

  const handleAdd = async () => {
    if (!formData.name || !formData.category || formData.price <= 0) {
      alert('Lengkapi semua data produk!');
      return;
    }
    try {
      setSaving(true);
      await createProduct(formData);
      setFormData({ name: '', price: 0, category: '', stock: 0 });
      setShowAddForm(false);
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menambah produk');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({ name: product.name, price: product.price, category: product.category, stock: product.stock });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.category || formData.price <= 0) {
      alert('Lengkapi semua data produk!');
      return;
    }
    if (!editingId) return;
    try {
      setSaving(true);
      await updateProduct(editingId, formData);
      setEditingId(null);
      setFormData({ name: '', price: 0, category: '', stock: 0 });
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal memperbarui produk');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus produk');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', price: 0, category: '', stock: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#6f4d3b] flex items-center gap-2">
          <List className="w-8 h-8" />
          Manajemen Produk
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-[#6f4d3b] to-[#8a5d45] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Gagal terhubung ke server</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={fetchProducts} className="ml-auto text-sm underline">Coba lagi</button>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#8a5d45]">
          <h2 className="text-xl font-bold text-[#6f4d3b] mb-4">Tambah Produk Baru</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Nama Produk</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
                placeholder="Contoh: Cappuccino"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Kategori</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
                placeholder="Contoh: Coffee, Food, Dessert"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Harga (Rp)</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#6f4d3b] mb-2">Stok Awal</label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-[#d9bfa4] rounded-lg focus:outline-none focus:border-[#8a5d45]"
                placeholder="100"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-[#8a5d45] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6f4d3b] transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-[#e8d9c9] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#8a5d45]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Memuat produk dari database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#6f4d3b] to-[#8a5d45] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nama Produk</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Harga</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Stok</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8d9c9]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Belum ada produk. Tambahkan produk baru!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#faf7f4] transition-colors">
                      {Number(editingId) === Number(product.id) ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-2 py-1 border border-[#d9bfa4] rounded focus:outline-none focus:border-[#8a5d45]"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="w-full px-2 py-1 border border-[#d9bfa4] rounded focus:outline-none focus:border-[#8a5d45]"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.price || ''}
                              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                              className="w-full px-2 py-1 border border-[#d9bfa4] rounded focus:outline-none focus:border-[#8a5d45]"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.stock || ''}
                              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                              className="w-full px-2 py-1 border border-[#d9bfa4] rounded focus:outline-none focus:border-[#8a5d45]"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="text-green-600 hover:text-green-800 disabled:opacity-60"
                                title="Simpan"
                              >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                              </button>
                              <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800" title="Batal">
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-semibold text-[#6f4d3b]">{product.name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-[#f4ede5] text-[#6f4d3b] px-3 py-1 rounded-full text-sm">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#8a5d45] font-semibold">
                            Rp {product.price.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-[#8a5d45] hover:text-[#6f4d3b]"
                                title="Edit"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Hapus"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
