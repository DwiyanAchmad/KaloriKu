import React from 'react';
import { Camera, Sparkles, PieChart, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartScanning: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onStartScanning }) => {
  const steps = [
    {
      icon: <Camera className="w-8 h-8 text-white" />,
      title: "1. Foto Makananmu",
      desc: "Ambil foto makanan yang ingin kamu makan. Pastikan pencahayaan cukup dan makanan terlihat jelas agar AI dapat mendeteksinya.",
      color: "bg-blue-500"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: "2. AI Menganalisis",
      desc: "Sistem cerdas kami akan memindai gambar, mengidentifikasi jenis makanan, porsi, dan bahan-bahan yang ada di dalamnya secara otomatis.",
      color: "bg-purple-500"
    },
    {
      icon: <PieChart className="w-8 h-8 text-white" />,
      title: "3. Dapatkan Nutrisi",
      desc: "Lihat hasil lengkap mulai dari total kalori, protein, lemak, karbohidrat, hingga saran kesehatan yang disesuaikan untukmu.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Cara Kerja <span className="text-emerald-600">KaloriKu</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Teknologi canggih yang memudahkanmu memantau asupan nutrisi hanya dalam hitungan detik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 ${step.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
            
            <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform group-hover:-translate-y-1 transition-transform duration-300`}>
              {step.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Siap Memulai Hidup Sehat?</h3>
          <p className="text-green-50 mb-8 max-w-xl mx-auto">
            Tidak perlu ribet mencatat manual. Biarkan KaloriKu membantumu mencapai target kesehatanmu hari ini.
          </p>
          <button 
            onClick={onStartScanning}
            className="bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg flex items-center gap-2 mx-auto"
          >
            Mulai Scan Sekarang <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;