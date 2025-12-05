import React, { useState } from 'react';
import { Leaf, Camera } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'how-it-works') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="KaloriKu" 
                className="h-10 w-auto object-contain" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-full text-white shadow-sm">
                  <Leaf className="h-5 w-5" fill="white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Kalori<span className="text-emerald-600">Ku</span>
                </h1>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="text-sm font-medium text-gray-500 hover:text-green-600 transition-colors hidden sm:block bg-transparent border-none cursor-pointer"
            >
              Cara Kerja
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Camera size={16} />
              <span>Scan Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;