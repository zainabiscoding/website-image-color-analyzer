import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PaletteColor } from '../types';
import { rgbString, getContrastInfo, hexToRgb } from '../utils/colorUtils';

interface Props {
  color: PaletteColor;
  index: number;
}

export default function ColorSwatch({ color, index }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  const luminance = color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114;
  const textColor = luminance > 128 ? 'text-gray-800' : 'text-white';

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div
        className="h-24 sm:h-28 relative cursor-pointer"
        style={{ backgroundColor: color.hex }}
        onClick={() => handleCopy(color.hex, 'hex')}
      >
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${textColor}`}>
          <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            {copied === 'hex' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs font-bold">
              {copied === 'hex' ? 'Copied! ✓' : 'Copy'}
            </span>
          </div>
        </div>
        {color.role && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/30 backdrop-blur-sm ${textColor} shadow-sm`}>
            {color.role}
          </span>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-gray-800">{color.hex}</span>
          <button
            onClick={() => handleCopy(color.hex, 'hex-btn')}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            title="Copy HEX"
          >
            {copied === 'hex' || copied === 'hex-btn' ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{rgbString(color.rgb)}</span>
          <button
            onClick={() => handleCopy(rgbString(color.rgb), 'rgb')}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            title="Copy RGB"
          >
            {copied === 'rgb' ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
        </div>
        {color.proportion !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${color.proportion}%`, backgroundColor: color.hex }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{color.proportion}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
