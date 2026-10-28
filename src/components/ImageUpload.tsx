import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { validateImageFile, extractColorsFromImage } from '../utils/colorExtraction';
import { PaletteColor } from '../types';
import { translations, Language } from '../utils/translations';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
  border: string;
}

interface Props {
  onColorsExtracted: (colors: PaletteColor[], imageUrl: string) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
  language?: Language;
  theme?: ThemeColors;
}

export default function ImageUpload({ onColorsExtracted, onLoading, onError, language = 'en', theme }: Props) {
  const t = translations[language];
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      onError(validation.error!);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);

      const img = new window.Image();
      img.onload = () => {
        onLoading(true);
        setTimeout(() => {
          try {
            const colors = extractColorsFromImage(img);
            if (colors.length === 0) {
              onError('Could not extract meaningful colors from this image. Try a more colorful image.');
              onLoading(false);
              return;
            }
            onColorsExtracted(colors, dataUrl);
            onLoading(false);
          } catch {
            onError('Failed to analyze image. Please try a different image.');
            onLoading(false);
          }
        }, 500);
      };
      img.onerror = () => {
        onError('Failed to load image. Please try a different file.');
        onLoading(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-pink-400 bg-gradient-to-br from-orange-50 to-pink-50 scale-[1.02] shadow-lg shadow-pink-100'
              : 'border-gray-200 bg-gradient-to-br from-white to-orange-50/30 hover:border-pink-300 hover:shadow-md hover:shadow-pink-100/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              dragActive 
                ? 'bg-gradient-to-br from-orange-400 to-pink-500 rotate-6' 
                : 'bg-gradient-to-br from-orange-100 to-pink-100'
            }`}>
              <Upload className={`w-7 h-7 ${dragActive ? 'text-white' : 'text-pink-500'}`} />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: theme?.text || '#1F2937' }}>
                {dragActive ? t.uploadDragActive : t.uploadTitle}
              </p>
              <p className="text-sm mt-2" style={{ color: theme?.text, opacity: 0.6 }}>
                {t.uploadSubtitle}
              </p>
              <p className="text-xs mt-1" style={{ color: theme?.text, opacity: 0.4 }}>
                {t.uploadFormats}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={preview}
            alt="Uploaded preview"
            className="w-full max-h-64 object-contain rounded-2xl border border-gray-200 bg-gray-50"
          />
          <button
            onClick={clearPreview}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}
