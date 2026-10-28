import { Globe, Image } from 'lucide-react';
import { AnalysisMode } from '../types';

interface Props {
  onSelectMode: (mode: AnalysisMode) => void;
  selectedMode: AnalysisMode;
}

export default function ModeSelector({ onSelectMode, selectedMode }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto">
      <button
        onClick={() => onSelectMode('image')}
        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
          selectedMode === 'image'
            ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-md shadow-violet-100'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Image className="w-5 h-5" />
        <span className="font-medium">Image Upload</span>
      </button>
      <button
        onClick={() => onSelectMode('website')}
        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
          selectedMode === 'website'
            ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-md shadow-violet-100'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Globe className="w-5 h-5" />
        <span className="font-medium">Website URL</span>
      </button>
    </div>
  );
}
