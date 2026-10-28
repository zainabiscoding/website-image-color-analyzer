import { Palette, Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';
import { Palette as PaletteType } from '../types';
import ColorSwatch from './ColorSwatch';
import { formatPaletteForCopy, exportPaletteAsCSS, exportPaletteAsJSON, downloadFile } from '../utils/exportUtils';

interface Props {
  palette: PaletteType;
  imageUrl?: string;
}

export default function PaletteDisplay({ palette, imageUrl }: Props) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const text = formatPaletteForCopy(palette);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSS = () => {
    const css = exportPaletteAsCSS(palette);
    downloadFile(css, `${palette.name}-palette.css`, 'text/css');
  };

  const handleExportJSON = () => {
    const json = exportPaletteAsJSON(palette);
    downloadFile(json, `${palette.name}-palette.json`, 'application/json');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-violet-500" />
            Extracted Palette
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {palette.colors.length} colors from {palette.sourceType === 'image' ? 'image' : palette.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copiedAll ? 'Copied!' : 'Copy All'}
          </button>
          <button
            onClick={handleExportCSS}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSS
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
        </div>
      </div>

      {/* Color strip preview */}
      <div className="flex h-8 rounded-xl overflow-hidden shadow-sm">
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-300 hover:flex-[2]"
            style={{ backgroundColor: color.hex }}
            title={`${color.hex} - Click to copy`}
            onClick={() => navigator.clipboard.writeText(color.hex)}
          />
        ))}
      </div>

      {imageUrl && palette.sourceType === 'image' && (
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
          <img src={imageUrl} alt="Source" className="w-16 h-16 rounded-lg object-cover" />
          <div className="text-sm text-gray-500">
            <p className="font-medium text-gray-700">Source Image</p>
            <p>Colors extracted using Canvas API color quantization</p>
          </div>
        </div>
      )}

      {/* Color grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {palette.colors.map((color, index) => (
          <ColorSwatch key={index} color={color} index={index} />
        ))}
      </div>
    </div>
  );
}
