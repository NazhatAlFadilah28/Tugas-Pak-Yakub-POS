import { Coffee, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#6f4d3b] to-[#8a5d45] rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Coffee className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Elzata Coffee</h1>
          </div>
          <p className="text-xl md:text-2xl text-[#f4ede5] mb-4">
            Nikmati Kehangatan Setiap Tegukan
          </p>
          <p className="text-lg text-[#e8d9c9] leading-relaxed">
            Tempat dimana setiap cangkir kopi dibuat dengan penuh cinta dan dedikasi. 
            Kami menyajikan kopi premium dari biji pilihan terbaik Indonesia.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-[#e8d9c9]">
          <h2 className="text-2xl font-bold text-[#6f4d3b] mb-4">Tentang Kami</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Elzata Coffee didirikan dengan visi untuk menghadirkan pengalaman minum kopi 
            yang tak terlupakan. Kami percaya bahwa setiap cangkir kopi memiliki cerita, 
            dan kami ingin berbagi cerita itu dengan Anda.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Dengan barista berpengalaman dan bahan-bahan berkualitas tinggi, kami 
            berkomitmen untuk memberikan layanan terbaik dan menciptakan suasana 
            yang nyaman untuk semua pelanggan kami.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-[#e8d9c9]">
          <h2 className="text-2xl font-bold text-[#6f4d3b] mb-4">Keunggulan Kami</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8a5d45] rounded-full mt-2"></div>
              <p className="text-gray-700">Biji kopi premium dari perkebunan terpilih di Indonesia</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8a5d45] rounded-full mt-2"></div>
              <p className="text-gray-700">Barista profesional dan bersertifikat</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8a5d45] rounded-full mt-2"></div>
              <p className="text-gray-700">Suasana cozy dan instagramable</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8a5d45] rounded-full mt-2"></div>
              <p className="text-gray-700">Free WiFi dan colokan untuk bekerja</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8a5d45] rounded-full mt-2"></div>
              <p className="text-gray-700">Menu variatif dari traditional hingga modern</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gradient-to-br from-[#f4ede5] to-white rounded-xl p-6 shadow-lg border border-[#e8d9c9]">
        <h2 className="text-2xl font-bold text-[#6f4d3b] mb-6">Informasi Kontak</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#8a5d45] p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#6f4d3b]">Alamat</h3>
              <p className="text-gray-700 text-sm">Jl. Kopi Manis No. 123<br />Jakarta Selatan</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#8a5d45] p-2 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#6f4d3b]">Jam Buka</h3>
              <p className="text-gray-700 text-sm">Senin - Minggu<br />08:00 - 22:00</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#8a5d45] p-2 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#6f4d3b]">Telepon</h3>
              <p className="text-gray-700 text-sm">+62 812-3456-7890</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#8a5d45] p-2 rounded-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#6f4d3b]">Email</h3>
              <p className="text-gray-700 text-sm">info@elzatacoffee.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Drinks */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-[#e8d9c9]">
        <h2 className="text-2xl font-bold text-[#6f4d3b] mb-6">Menu Signature Kami</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#faf7f4] to-[#f4ede5] p-4 rounded-lg border border-[#d9bfa4]">
            <h3 className="font-bold text-[#6f4d3b] text-lg mb-2">☕ Elzata Signature</h3>
            <p className="text-gray-700 text-sm">Espresso blend dengan sentuhan karamel dan vanilla cream</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#faf7f4] to-[#f4ede5] p-4 rounded-lg border border-[#d9bfa4]">
            <h3 className="font-bold text-[#6f4d3b] text-lg mb-2">🥤 Mocaccino Premium</h3>
            <p className="text-gray-700 text-sm">Perpaduan sempurna cokelat dan kopi dengan whipped cream</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#faf7f4] to-[#f4ede5] p-4 rounded-lg border border-[#d9bfa4]">
            <h3 className="font-bold text-[#6f4d3b] text-lg mb-2">🍵 Kopi Susu Gula Aren</h3>
            <p className="text-gray-700 text-sm">Kopi robusta asli dengan gula aren alami</p>
          </div>
        </div>
      </div>
    </div>
  );
}
