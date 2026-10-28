import { useState } from 'react';
import { Monitor, Smartphone, AlertTriangle } from 'lucide-react';
import { PaletteColor } from '../types';
import { getContrastInfo, getTextColorForBg } from '../utils/colorUtils';

interface Props {
  colors: PaletteColor[];
  paletteName: string;
}

export default function PalettePreview({ colors, paletteName }: Props) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const getColor = (role: string): string => {
    const found = colors.find((c) => c.role === role);
    return found?.hex || colors[0]?.hex || '#6D5AE6';
  };

  const bgColor = getColor('background') || '#F4F1EA';
  const primaryColor = getColor('primary') || '#6D5AE6';
  const secondaryColor = getColor('secondary') || '#E6CBA8';
  const textColor = getColor('text') || '#24243A';
  const accentColor = getColor('accent') || '#B9C8B1';
  const surfaceColor = getColor('surface') || '#FFFFFF';
  const borderColor = getColor('border') || '#E5E7EB';

  const textOnPrimary = getTextColorForBg(primaryColor);
  const textOnBg = getTextColorForBg(bgColor);
  const textOnSurface = getTextColorForBg(surfaceColor);

  const contrastWarnings: { pair: string; ratio: number }[] = [];
  
  const textBgContrast = getContrastInfo(
    { r: parseInt(textOnBg.slice(1, 3), 16), g: parseInt(textOnBg.slice(3, 5), 16), b: parseInt(textOnBg.slice(5, 7), 16) },
    { r: parseInt(bgColor.slice(1, 3), 16), g: parseInt(bgColor.slice(3, 5), 16), b: parseInt(bgColor.slice(5, 7), 16) }
  );
  
  if (!textBgContrast.accessible) {
    contrastWarnings.push({ pair: 'Text on Background', ratio: textBgContrast.ratio });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-500" />
            Preview
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{paletteName}</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'desktop' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'mobile' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {contrastWarnings.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700">
            <p className="font-medium">Accessibility Warning</p>
            {contrastWarnings.map((w, i) => (
              <p key={i}>{w.pair}: contrast ratio {w.ratio}:1 (below WCAG AA 4.5:1)</p>
            ))}
          </div>
        </div>
      )}

      {/* Preview mockup */}
      <div className={`mx-auto transition-all duration-300 ${
        viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
      }`}>
        <div
          className="rounded-2xl overflow-hidden shadow-lg border border-gray-200"
          style={{ backgroundColor: bgColor }}
        >
          {/* Nav bar */}
          <div
            className="px-6 py-4 flex items-center justify-between border-b"
            style={{ backgroundColor: surfaceColor, borderColor }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: primaryColor }} />
              <span className="font-bold text-sm" style={{ color: textColor }}>BrandName</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-xs" style={{ color: textColor, opacity: 0.7 }}>Home</span>
              <span className="text-xs" style={{ color: textColor, opacity: 0.7 }}>About</span>
              <span className="text-xs" style={{ color: textColor, opacity: 0.7 }}>Services</span>
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-medium"
                style={{ backgroundColor: primaryColor, color: textOnPrimary }}
              >
                Get Started
              </button>
            </div>
            <div className="sm:hidden">
              <div className="w-6 h-0.5 rounded" style={{ backgroundColor: textColor }} />
              <div className="w-6 h-0.5 rounded mt-1" style={{ backgroundColor: textColor }} />
              <div className="w-6 h-0.5 rounded mt-1" style={{ backgroundColor: textColor }} />
            </div>
          </div>

          {/* Hero section */}
          <div className="px-6 py-10 sm:py-16 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: textColor }}>
              Welcome to Our Platform
            </h1>
            <p className="text-sm max-w-md mx-auto mb-6 opacity-70" style={{ color: textColor }}>
              Build beautiful experiences with our carefully crafted design system and tools.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                className="px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg"
                style={{ backgroundColor: primaryColor, color: textOnPrimary, boxShadow: `0 4px 14px ${primaryColor}40` }}
              >
                Start Free Trial
              </button>
              <button
                className="px-6 py-2.5 rounded-xl text-sm font-medium border-2"
                style={{ borderColor: secondaryColor, color: textColor }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Cards section */}
          <div className="px-6 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Fast Performance', desc: 'Lightning quick load times' },
                { title: 'Easy to Use', desc: 'Intuitive interface design' },
                { title: 'Secure', desc: 'Enterprise-grade security' },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border"
                  style={{ backgroundColor: surfaceColor, borderColor }}
                >
                  <div
                    className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${accentColor}30` }}
                  >
                    {['⚡', '🎯', '🔒'][i]}
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: textColor }}>{card.title}</h3>
                  <p className="text-xs opacity-60" style={{ color: textColor }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t text-center" style={{ borderColor }}>
            <p className="text-xs opacity-50" style={{ color: textColor }}>
              © 2024 BrandName. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Color mapping legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Background', color: bgColor },
          { label: 'Primary', color: primaryColor },
          { label: 'Secondary', color: secondaryColor },
          { label: 'Text', color: textColor },
          { label: 'Accent', color: accentColor },
          { label: 'Surface', color: surfaceColor },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: item.color }} />
            <span className="text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
