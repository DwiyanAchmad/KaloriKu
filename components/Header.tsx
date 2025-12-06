import React from 'react';
import { Camera } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'how-it-works') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Bagian Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <img 
              src="/gambar/LogoKaloriKu.png" 
              alt="Logo Aplikasi KaloriKu" 
              // PERBAIKAN DI SINI:
              // h-10 diubah jadi h-12 (mobile) dan md:h-14 (layar besar)
              // agar tulisan di dalam logo terbaca jelas
              className="h-12 md:h-14 w-auto object-contain" 
            />
          </div>

          {/* Bagian Tombol Kanan */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="text-xs sm:text-sm font-medium text-gray-500 hover:text-green-600 transition-colors bg-transparent border-none cursor-pointer"
            >
              Cara Kerja
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden xs:inline">Scan Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;