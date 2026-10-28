import { useState } from 'react';
import { Monitor, Smartphone, AlertTriangle } from 'lucide-react';
import { PaletteColor } from '../types';
import { getContrastInfo, getTextColorForBg, hexToRgb } from '../utils/colorUtils';

interface Props {
  colors: PaletteColor[];
  paletteName: string;
}

interface ColorRoles {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textOnPrimary: string;
  textOnBg: string;
  border: string;
}

function assignColorRoles(colors: PaletteColor[]): ColorRoles {
  if (colors.length === 0) {
    return {
      background: '#FFFFFF',
      surface: '#F9FAFB',
      primary: '#6366F1',
      secondary: '#A5B4FC',
      accent: '#F59E0B',
      text: '#111827',
      textOnPrimary: '#FFFFFF',
      textOnBg: '#111827',
      border: '#E5E7EB',
    };
  }

  // Sort colors by proportion (most common first)
  const sortedByProportion = [...colors].sort((a, b) => (b.proportion || 0) - (a.proportion || 0));
  
  // Analyze each color
  const analyzed = colors.map((color) => {
    const rgb = hexToRgb(color.hex);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    
    return {
      ...color,
      luminance,
      saturation,
    };
  });

  // Find background: lightest color with high proportion
  const lightColors = analyzed.filter(c => c.luminance > 0.8).sort((a, b) => (b.proportion || 0) - (a.proportion || 0));
  const background = lightColors[0]?.hex || analyzed.find(c => c.luminance > 0.7)?.hex || '#FFFFFF';

  // Find surface: slightly darker than background
  const surfaceColors = analyzed.filter(c => c.luminance > 0.9 && c.hex !== background);
  const surface = surfaceColors[0]?.hex || '#FFFFFF';

  // Find text: darkest color
  const darkColors = analyzed.filter(c => c.luminance < 0.3).sort((a, b) => a.luminance - b.luminance);
  const text = darkColors[0]?.hex || '#111827';

  // Find primary: most saturated color with good visibility
  const saturatedColors = analyzed
    .filter(c => c.saturation > 0.3 && c.luminance > 0.2 && c.luminance < 0.8)
    .sort((a, b) => b.saturation - a.saturation);
  const primary = saturatedColors[0]?.hex || analyzed.find(c => c.saturation > 0.2)?.hex || '#6366F1';

  // Find secondary: less saturated than primary
  const secondaryColors = analyzed
    .filter(c => c.hex !== primary && c.hex !== background && c.hex !== text && c.saturation > 0.1)
    .sort((a, b) => b.saturation - a.saturation);
  const secondary = secondaryColors[1]?.hex || secondaryColors[0]?.hex || '#A5B4FC';

  // Find accent: different hue from primary
  const accentColors = analyzed
    .filter(c => c.hex !== primary && c.hex !== secondary && c.hex !== background && c.saturation > 0.2)
    .sort((a, b) => b.saturation - a.saturation);
  const accent = accentColors[0]?.hex || '#F59E0B';

  // Find border: light gray-ish color
  const borderColors = analyzed
    .filter(c => c.luminance > 0.7 && c.luminance < 0.95 && c.saturation < 0.1)
    .sort((a, b) => a.saturation - b.saturation);
  const border = borderColors[0]?.hex || '#E5E7EB';

  return {
    background,
    surface,
    primary,
    secondary,
    accent,
    text,
    border,
    textOnPrimary: getTextColorForBg(primary),
    textOnBg: getTextColorForBg(background),
  };
}

export default function PalettePreview({ colors, paletteName }: Props) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const roles = assignColorRoles(colors);

  const { background, surface, primary, secondary, accent, text, border, textOnPrimary, textOnBg } = roles;

  const contrastWarnings: { pair: string; ratio: number }[] = [];
  
  const textBgContrast = getContrastInfo(
    { r: parseInt(textOnBg.slice(1, 3), 16), g: parseInt(textOnBg.slice(3, 5), 16), b: parseInt(textOnBg.slice(5, 7), 16) },
    { r: parseInt(background.slice(1, 3), 16), g: parseInt(background.slice(3, 5), 16), b: parseInt(background.slice(5, 7), 16) }
  );
  
  if (!textBgContrast.accessible) {
    contrastWarnings.push({ pair: 'Text on Background', ratio: textBgContrast.ratio });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            Live Preview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {paletteName} 👀
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full p-1 border border-blue-100">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-full transition-all ${
              viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-full transition-all ${
              viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'
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
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-200"
          style={{ backgroundColor: background }}
        >
          {/* Nav bar */}
          <div
            className="px-6 py-4 flex items-center justify-between border-b"
            style={{ backgroundColor: surface, borderColor: border }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg shadow-sm" style={{ backgroundColor: primary }} />
              <span className="font-bold text-sm" style={{ color: text }}>BrandName</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <span className="text-sm font-medium" style={{ color: text, opacity: 0.7 }}>Home</span>
              <span className="text-sm font-medium" style={{ color: text, opacity: 0.7 }}>About</span>
              <span className="text-sm font-medium" style={{ color: text, opacity: 0.7 }}>Services</span>
              <button
                className="px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: primary, color: textOnPrimary }}
              >
                Get Started
              </button>
            </div>
            <div className="sm:hidden">
              <div className="w-6 h-0.5 rounded" style={{ backgroundColor: text }} />
              <div className="w-6 h-0.5 rounded mt-1.5" style={{ backgroundColor: text }} />
              <div className="w-6 h-0.5 rounded mt-1.5" style={{ backgroundColor: text }} />
            </div>
          </div>

          {/* Hero section */}
          <div className="px-6 py-12 sm:py-20 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight" style={{ color: text }}>
              Welcome to Our Platform
            </h1>
            <p className="text-base max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: text, opacity: 0.7 }}>
              Build beautiful experiences with our carefully crafted design system and tools.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                className="px-8 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: primary, color: textOnPrimary, boxShadow: `0 4px 14px ${primary}40` }}
              >
                Start Free Trial
              </button>
              <button
                className="px-8 py-3 rounded-xl text-base font-semibold border-2 hover:shadow-md transition-shadow"
                style={{ borderColor: secondary, color: text }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features section */}
          <div className="px-6 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: '⚡', title: 'Fast Performance', desc: 'Lightning quick load times for the best user experience' },
                { icon: '🎯', title: 'Easy to Use', desc: 'Intuitive interface design that anyone can master' },
                { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security to protect your data' },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: surface, borderColor: border }}
                >
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: `${accent}20` }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: text }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: text, opacity: 0.6 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA section */}
          <div className="px-6 pb-12">
            <div
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: primary }}
            >
              <h2 className="text-2xl font-bold mb-3" style={{ color: textOnPrimary }}>
                Ready to Get Started?
              </h2>
              <p className="text-base mb-6 opacity-90" style={{ color: textOnPrimary }}>
                Join thousands of satisfied customers today
              </p>
              <button
                className="px-8 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: surface, color: text }}
              >
                Sign Up Now
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6 border-t" style={{ borderColor: border }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm" style={{ color: text, opacity: 0.5 }}>
                © 2024 BrandName. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-sm" style={{ color: text, opacity: 0.5 }}>Privacy</span>
                <span className="text-sm" style={{ color: text, opacity: 0.5 }}>Terms</span>
                <span className="text-sm" style={{ color: text, opacity: 0.5 }}>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color mapping legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { label: 'Background', color: background },
          { label: 'Surface', color: surface },
          { label: 'Primary', color: primary },
          { label: 'Secondary', color: secondary },
          { label: 'Accent', color: accent },
          { label: 'Text', color: text },
          { label: 'Border', color: border },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
