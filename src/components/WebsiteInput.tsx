import { useState } from 'react';
import { Globe, Loader2, AlertCircle } from 'lucide-react';
import { validateUrl, analyzeWebsite } from '../utils/websiteAnalysis';
import { Palette } from '../types';

interface Props {
  onPaletteReady: (palette: Palette) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
}

export default function WebsiteInput({ onPaletteReady, onLoading, onError }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateUrl(url);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }

    onLoading(true);
    try {
      const palette = await analyzeWebsite(url);
      onPaletteReady(palette);
    } catch (err: any) {
      onError(err.message || 'Failed to analyze website. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Globe className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="Enter website URL (e.g., github.com)"
            className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-white transition-all duration-200 text-gray-700 placeholder:text-gray-400 focus:outline-none ${
              error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-violet-400 focus:shadow-md focus:shadow-violet-100'
            }`}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm px-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={!url.trim()}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Analyze Website Colors
        </button>
      </form>
      <p className="text-xs text-gray-400 text-center mt-3">
        Note: Some websites may block automated access. Results depend on the site's HTML/CSS structure.
      </p>
    </div>
  );
}
