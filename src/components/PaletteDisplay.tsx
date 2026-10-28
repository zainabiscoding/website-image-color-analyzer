import { Palette, Copy, Check, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { Palette as PaletteType } from '../types';
import ColorSwatch from './ColorSwatch';
import { formatPaletteForCopy, exportPaletteAsCSS, exportPaletteAsJSON, downloadFile } from '../utils/exportUtils';
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
  palette: PaletteType;
  imageUrl?: string;
  onPreview?: () => void;
  isPreviewing?: boolean;
  theme?: ThemeColors;
  language?: Language;
}

export default function PaletteDisplay({ palette, imageUrl, onPreview, isPreviewing, theme, language = 'en' }: Props) {
  const t = translations[language];
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
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme?.text || '#1F2937' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme?.primary || '#FF6B35'}, ${theme?.secondary || '#F7931E'})` }}>
              <Palette className="w-4 h-4 text-white" />
            </div>
            {t.extractedPalette}
          </h2>
          <p className="text-sm mt-1" style={{ color: theme?.text, opacity: 0.6 }}>
            {palette.colors.length} {t.colorsExtracted}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onPreview && (
            <button
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: isPreviewing ? `${theme?.primary}20` : theme?.surface,
                color: isPreviewing ? theme?.primary : theme?.text,
                border: `1px solid ${isPreviewing ? theme?.primary : theme?.border}`
              }}
            >
              <Eye className="w-4 h-4" />
              {isPreviewing ? t.previewing : t.preview}
            </button>
          )}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: theme?.surface,
              color: theme?.text,
              border: `1px solid ${theme?.border}`
            }}
          >
            {copiedAll ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copiedAll ? t.copied : t.copyAll}
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
