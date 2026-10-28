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
  const [copiedColorKey, setCopiedColorKey] = useState<string | null>(null);

  const handleCopyColor = async (hex: string, key: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = hex;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedColorKey(key);
    setTimeout(() => setCopiedColorKey(null), 1500);
  };

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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Generated Palettes
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {palettes.length} beautiful variations based on your colors
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
              className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'border-pink-400 shadow-lg shadow-pink-100/50 bg-gradient-to-br from-white to-pink-50/30'
                  : 'border-gray-100 hover:border-pink-200 hover:shadow-md bg-white'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800">{paletteStyleLabels[palette.style]}</h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-sm">
                          Previewing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{paletteStyleDescriptions[palette.style]}</p>
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
                <div className="flex h-12 mt-3 rounded-xl overflow-hidden shadow-sm">
                  {palette.colors.map((color, i) => {
                    const colorKey = `${palette.id}-${i}`;
                    const isCopiedColor = copiedColorKey === colorKey;
                    return (
                      <div
                        key={i}
                        className="flex-1 relative group/color transition-all duration-200 hover:flex-[2] cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.hex} - Click to copy`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyColor(color.hex, colorKey);
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity">
                          {isCopiedColor ? (
                            <Check className="w-4 h-4" style={{ color: color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114 > 128 ? '#1a1a2e' : '#ffffff' }} />
                          ) : (
                            <span className="text-[10px] font-mono font-medium"
                              style={{ color: color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114 > 128 ? '#1a1a2e' : '#ffffff' }}
                            >
                              {color.hex}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Preview button */}
                <button
                  onClick={() => onSelectPalette(palette)}
                  className={`mt-3 text-xs font-bold transition-all ${
                    isSelected 
                      ? 'text-pink-600' 
                      : 'text-gray-500 hover:text-pink-600 hover:translate-x-1'
                  }`}
                >
                  {isSelected ? '✓ Previewing this palette' : 'Preview this palette →'}
                </button>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {palette.colors.map((color, i) => {
                      const colorKey = `${palette.id}-expanded-${i}`;
                      const isCopiedColor = copiedColorKey === colorKey;
                      return (
                        <div key={i} className="text-center group/color-card">
                          <div
                            className="w-full aspect-square rounded-lg mb-1.5 shadow-sm cursor-pointer relative overflow-hidden"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => handleCopyColor(color.hex, colorKey)}
                            title={`${color.hex} - Click to copy`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color-card:opacity-100 transition-opacity bg-black/10">
                              {isCopiedColor ? (
                                <Check className="w-5 h-5" style={{ color: color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114 > 128 ? '#1a1a2e' : '#ffffff' }} />
                              ) : (
                                <Copy className="w-5 h-5" style={{ color: color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114 > 128 ? '#1a1a2e' : '#ffffff' }} />
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] font-mono text-gray-600 truncate">{color.hex}</p>
                          <p className="text-[9px] text-gray-400">{color.role}</p>
                        </div>
                      );
                    })}
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
