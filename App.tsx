import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import NutritionResult from './components/NutritionResult';
import HowItWorks from './components/HowItWorks';
import { analyzeFoodImage } from './services/geminiService';
import { NutritionData } from './types';
import { Utensils, Sparkles, ChefHat } from 'lucide-react';

type ViewState = 'home' | 'how-it-works';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (base64: string) => {
    setImage(base64);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeFoodImage(base64);
      setResult(data);
    } catch (err) {
      setError("Gagal menganalisis gambar. Pastikan gambar jelas dan mengandung makanan, lalu coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    // If navigating home and we have no results, reset could be optional, 
    // but here we keep the state if the user just clicked "How it works" and went back.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-12">
      <Header onNavigate={handleNavigate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {currentView === 'how-it-works' ? (
          <HowItWorks onStartScanning={() => setCurrentView('home')} />
        ) : (
          <>
            {!result && !loading && !image && (
              <div className="text-center mb-12 animate-fade-in-down">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  Ketahui Apa yang <br className="hidden md:block" />
                  <span className="text-green-600">Kamu Makan</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Upload foto makananmu dan biarkan AI menghitung kalori serta nutrisinya dalam hitungan detik. Hidup sehat jadi lebih mudah.
                </p>
                
                <div className="flex justify-center gap-6 text-sm text-gray-500 mb-10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-yellow-500 w-5 h-5" />
                    <span>AI Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="text-orange-500 w-5 h-5" />
                    <span>Analisis Makro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="text-blue-500 w-5 h-5" />
                    <span>Kenali Makanan</span>
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              {!result && (
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                   {image && loading && (
                     <div className="mb-6 rounded-xl overflow-hidden h-64 relative bg-gray-100">
                        <img src={image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           {/* Loader is handled inside ImageUploader component state usually, but visually we show preview here */}
                        </div>
                     </div>
                   )}
                   
                   {/* If image is selected but failed, show image again to allow retry or show different state */}
                   {!loading && image && error && (
                     <div className="mb-6 rounded-xl overflow-hidden h-64 relative bg-gray-100">
                       <img src={image} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                   )}

                   {!image && (
                      <ImageUploader onImageSelect={handleImageSelect} isLoading={loading} />
                   )}

                   {loading && (
                     <div className="text-center py-12">
                        <div className="inline-block p-4 rounded-full bg-green-50 mb-4 animate-bounce">
                          <Sparkles className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Sedang Menganalisis...</h3>
                        <p className="text-gray-500 mt-2">AI kami sedang mengidentifikasi makananmu.</p>
                     </div>
                   )}
                </div>
              )}

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">!</div>
                  <div>
                    <p className="font-bold">Oops!</p>
                    <p>{error}</p>
                    <button onClick={handleReset} className="text-sm underline mt-1">Coba Lagi</button>
                  </div>
                </div>
              )}

              {result && image && (
                <NutritionResult 
                  data={result} 
                  imageSrc={image} 
                  onReset={handleReset} 
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;