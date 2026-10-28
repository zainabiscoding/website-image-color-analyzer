import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { validateImageFile, extractColorsFromImage } from '../utils/colorExtraction';
import { PaletteColor } from '../types';

interface Props {
  onColorsExtracted: (colors: PaletteColor[], imageUrl: string) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
}

export default function ImageUpload({ onColorsExtracted, onLoading, onError }: Props) {
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
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-violet-400 bg-violet-50 scale-[1.02]'
              : 'border-gray-200 bg-gray-50/50 hover:border-violet-300 hover:bg-violet-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              dragActive ? 'bg-violet-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-6 h-6 ${dragActive ? 'text-violet-500' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-700">Drop an image here or click to browse</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, or WebP • Max 10MB</p>
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
