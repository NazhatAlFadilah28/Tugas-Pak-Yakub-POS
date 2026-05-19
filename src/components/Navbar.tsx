import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingCart, Package, List, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Coffee, label: 'Home' },
    { path: '/sales', icon: ShoppingCart, label: 'Penjualan' },
    { path: '/purchase', icon: Package, label: 'Pembelian' },
    { path: '/products', icon: List, label: 'Produk' },
    { path: '/reports', icon: BarChart3, label: 'Laporan' },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#6f4d3b] to-[#8a5d45] text-white shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition">
            <Coffee className="w-8 h-8" />
            <span>Elzata Coffee</span>
          </Link>
          
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden pb-3 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
