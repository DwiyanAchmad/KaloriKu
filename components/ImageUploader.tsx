import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon upload file gambar.');
      return;
    }

    // Check file size (20MB limit)
    const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB
    if (file.size > maxSizeInBytes) {
      alert('Ukuran file terlalu besar. Maksimal 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out text-center cursor-pointer
          ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          {isLoading ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="h-16 w-16 text-green-600 animate-spin mb-4" />
              <p className="text-lg font-semibold text-gray-700">Sedang Menganalisis...</p>
              <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
            </div>
          ) : (
            <>
              <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition-colors">
                <Upload className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  Klik untuk upload atau drag & drop
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Mendukung JPG, PNG, WEBP (Max 20MB)
                </p>
              </div>
              <div className="flex gap-4 mt-2">
                <button className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                  <Camera size={14} /> Ambil Foto
                </button>
                <button className="flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                  <ImageIcon size={14} /> Pilih dari Galeri
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;