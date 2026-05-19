import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getTransactions, getSummary, type Transaction, type Summary } from '../utils/api';

export default function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filter, setFilter] = useState<'all' | 'sale' | 'purchase'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [trxRes, sumRes] = await Promise.all([getTransactions(), getSummary()]);
      setTransactions(trxRes.data);
      setSummary(sumRes.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#6f4d3b] flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Laporan Transaksi
        </h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-[#f4ede5] text-[#6f4d3b] px-4 py-2 rounded-lg hover:bg-[#e8d9c9] transition-all font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Gagal memuat laporan</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={fetchData} className="ml-auto text-sm underline">Coba lagi</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Total Penjualan</h3>
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">
            Rp {(summary?.totalSales ?? 0).toLocaleString('id-ID')}
          </p>
          <p className="text-sm opacity-80 mt-1">{summary?.salesCount ?? 0} transaksi</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Total Pembelian</h3>
            <TrendingDown className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">
            Rp {(summary?.totalPurchases ?? 0).toLocaleString('id-ID')}
          </p>
          <p className="text-sm opacity-80 mt-1">{summary?.purchaseCount ?? 0} transaksi</p>
        </div>

        <div className={`bg-gradient-to-br rounded-xl p-6 text-white shadow-lg ${
          (summary?.profit ?? 0) >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Profit / Loss</h3>
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">
            Rp {Math.abs(summary?.profit ?? 0).toLocaleString('id-ID')}
          </p>
          <p className="text-sm opacity-80 mt-1">
            {(summary?.profit ?? 0) >= 0 ? '✅ Keuntungan' : '⚠️ Kerugian'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#6f4d3b] to-[#8a5d45] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Total Transaksi</h3>
            <Package className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{summary?.totalTransactions ?? 0}</p>
          <p className="text-sm opacity-80 mt-1">Semua transaksi</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'sale', 'purchase'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === f
                ? f === 'sale' ? 'bg-green-600 text-white'
                  : f === 'purchase' ? 'bg-red-600 text-white'
                  : 'bg-[#8a5d45] text-white'
                : 'bg-[#f4ede5] text-[#6f4d3b] hover:bg-[#e8d9c9]'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'sale' ? 'Penjualan' : 'Pembelian'}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg border border-[#e8d9c9] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#8a5d45]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Memuat data dari database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#6f4d3b] to-[#8a5d45] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipe</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8d9c9]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-[#faf7f4] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(transaction.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'sale'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'sale' ? 'Penjualan' : 'Pembelian'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#6f4d3b]">
                        {transaction.customer_name || transaction.supplier || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-xs">
                          {transaction.items.map((item, idx) => (
                            <div key={idx} className="text-xs">
                              {item.product_name || item.productName} ({item.quantity}x)
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#8a5d45]">
                        Rp {Number(transaction.total).toLocaleString('id-ID')}
                      </td>
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
