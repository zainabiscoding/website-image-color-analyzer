import { useState } from 'react';
import { Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { GeneratedPalette, PaletteStyle } from '../types';
import { paletteStyleLabels, paletteStyleDescriptions } from '../utils/paletteGeneration';
import { formatPaletteForCopy, exportPaletteAsCSS, exportPaletteAsJSON, downloadFile } from '../utils/exportUtils';

interface Props {
  palettes: GeneratedPalette[];
  onSelectPalette: (palette: GeneratedPalette) => void;
  selectedPaletteId?: string;
}

export default function GeneratedPalettes({ palettes, onSelectPalette, selectedPaletteId }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());

  const handleCopyPalette = async (palette: GeneratedPalette) => {
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
    setCopiedIds((prev) => new Set(prev).add(palette.id));
    setTimeout(() => {
      setCopiedIds((prev) => {
        const next = new Set(prev);
        next.delete(palette.id);
        return next;
      });
    }, 1500);
  };

  const handleExport = (palette: GeneratedPalette, format: 'css' | 'json') => {
    if (format === 'css') {
      downloadFile(exportPaletteAsCSS(palette), `${palette.style}-palette.css`, 'text/css');
    } else {
      downloadFile(exportPaletteAsJSON(palette), `${palette.style}-palette.json`, 'application/json');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Generated Palettes
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {palettes.length} alternative palettes based on your extracted colors
        </p>
      </div>

      <div className="grid gap-4">
        {palettes.map((palette) => {
          const isExpanded = expandedId === palette.id;
          const isSelected = selectedPaletteId === palette.id;
          const isCopied = copiedIds.has(palette.id);

          return (
            <div
              key={palette.id}
              className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-violet-400 shadow-md shadow-violet-100'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{paletteStyleLabels[palette.style]}</h3>
                      {isSelected && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">
                          Previewing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{paletteStyleDescriptions[palette.style]}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleCopyPalette(palette)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy palette"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleExport(palette, 'css')}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium text-gray-500"
                      title="Export as CSS"
                    >
                      CSS
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : palette.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Color strip */}
                <div
                  className="flex h-12 mt-3 rounded-xl overflow-hidden cursor-pointer shadow-sm"
                  onClick={() => onSelectPalette(palette)}
                >
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 relative group/color transition-all duration-200 hover:flex-[2]"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium opacity-0 group-hover/color:opacity-100 transition-opacity"
                        style={{ color: color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114 > 128 ? '#1a1a2e' : '#ffffff' }}
                      >
                        {color.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {palette.colors.map((color, i) => (
                      <div key={i} className="text-center">
                        <div
                          className="w-full aspect-square rounded-lg mb-1.5 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-[10px] font-mono text-gray-600 truncate">{color.hex}</p>
                        <p className="text-[9px] text-gray-400">{color.role}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleExport(palette, 'css')}
                      className="flex-1 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Export CSS
                    </button>
                    <button
                      onClick={() => handleExport(palette, 'json')}
                      className="flex-1 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
