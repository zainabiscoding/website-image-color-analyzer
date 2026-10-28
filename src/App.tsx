import { useState, useCallback } from 'react';
import { AlertCircle, X, CheckCircle2, Wand2 } from 'lucide-react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import PaletteDisplay from './components/PaletteDisplay';
import GeneratedPalettes from './components/GeneratedPalettes';
import PalettePreview from './components/PalettePreview';
import LoadingState from './components/LoadingState';
import { Palette, GeneratedPalette, PaletteColor } from './types';
import { generateAllPalettes } from './utils/paletteGeneration';
import { hexToRgb, rgbToHsl } from './utils/colorUtils';
import { translations, Language } from './utils/translations';
import { v4 as uuidv4 } from 'uuid';

function makeColor(hex: string, proportion: number, role: PaletteColor['role']): PaletteColor {
  const rgb = hexToRgb(hex);
  return { hex, rgb, hsl: rgbToHsl(rgb), proportion, role };
}

const DEMO_COLORS: PaletteColor[] = [
  makeColor('#6D5AE6', 22, 'primary'),
  makeColor('#E6CBA8', 18, 'secondary'),
  makeColor('#F4F1EA', 25, 'background'),
  makeColor('#24243A', 15, 'text'),
  makeColor('#B9C8B1', 12, 'accent'),
  makeColor('#FFFFFF', 8, 'surface'),
];

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
  border: string;
}

const generateRandomTheme = (): ThemeColors => {
  const themes: ThemeColors[] = [
    { primary: '#FF6B35', secondary: '#F7931E', accent: '#FFC857', background: '#FFF7ED', text: '#1F2937', surface: '#FFFFFF', border: '#E5E7EB' },
    { primary: '#6366F1', secondary: '#8B5CF6', accent: '#EC4899', background: '#EEF2FF', text: '#1E293B', surface: '#FFFFFF', border: '#E0E7FF' },
    { primary: '#10B981', secondary: '#059669', accent: '#F59E0B', background: '#ECFDF5', text: '#064E3B', surface: '#FFFFFF', border: '#D1FAE5' },
    { primary: '#EF4444', secondary: '#F97316', accent: '#FBBF24', background: '#FEF2F2', text: '#450A0A', surface: '#FFFFFF', border: '#FECACA' },
    { primary: '#3B82F6', secondary: '#06B6D4', accent: '#8B5CF6', background: '#EFF6FF', text: '#1E3A8A', surface: '#FFFFFF', border: '#DBEAFE' },
    { primary: '#8B5CF6', secondary: '#D946EF', accent: '#F472B6', background: '#FAF5FF', text: '#3B0764', surface: '#FFFFFF', border: '#E9D5FF' },
    { primary: '#14B8A6', secondary: '#06B6D4', accent: '#3B82F6', background: '#F0FDFA', text: '#134E4A', surface: '#FFFFFF', border: '#CCFBF1' },
    { primary: '#F59E0B', secondary: '#EF4444', accent: '#EC4899', background: '#FFFBEB', text: '#451A03', surface: '#FFFFFF', border: '#FEF3C7' },
  ];
  return themes[Math.floor(Math.random() * themes.length)];
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [originalPalette, setOriginalPalette] = useState<Palette | null>(null);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [selectedPreviewPalette, setSelectedPreviewPalette] = useState<GeneratedPalette | null>(null);
  const [isPreviewingOriginal, setIsPreviewingOriginal] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);
  const [theme, setTheme] = useState<ThemeColors>(generateRandomTheme());
  const [language, setLanguage] = useState<Language>('en');
  
  const t = translations[language];
  const isRTL = language === 'ar';

  const handleImageColorsExtracted = useCallback((colors: PaletteColor[], url: string) => {
    const palette: Palette = {
      id: uuidv4(),
      name: 'Image Analysis',
      sourceType: 'image',
      colors,
      createdAt: Date.now(),
    };
    setOriginalPalette(palette);
    setImageUrl(url);
    const generated = generateAllPalettes(colors, palette.id, 'image');
    setGeneratedPalettes(generated);
    setSelectedPreviewPalette(generated[0] || null);
    setHasResult(true);
    setSuccessMessage(translations[language].successExtracted);
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [language]);

  const handleError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleDemo = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const palette: Palette = {
        id: uuidv4(),
        name: 'Demo Palette',
        sourceType: 'image',
        colors: DEMO_COLORS,
        createdAt: Date.now(),
      };
      setOriginalPalette(palette);
      setImageUrl(null);
      const generated = generateAllPalettes(DEMO_COLORS, palette.id, 'image');
      setGeneratedPalettes(generated);
      setSelectedPreviewPalette(generated[0] || null);
      setHasResult(true);
      setLoading(false);
      setSuccessMessage(translations[language].successDemo);
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 800);
  }, [language]);

  const handleReset = () => {
    setOriginalPalette(null);
    setGeneratedPalettes([]);
    setSelectedPreviewPalette(null);
    setImageUrl(null);
    setHasResult(false);
    setError(null);
  };

  const handleRandomColors = () => {
    setTheme(generateRandomTheme());
  };

  const previewColors = isPreviewingOriginal
    ? originalPalette?.colors || []
    : selectedPreviewPalette?.colors || originalPalette?.colors || [];
  const previewName = isPreviewingOriginal
    ? 'Original Extracted Palette'
    : selectedPreviewPalette?.name || originalPalette?.name || '';

  const handlePreviewOriginal = () => {
    setIsPreviewingOriginal(true);
    setSelectedPreviewPalette(null);
  };

  const handlePreviewGenerated = (palette: GeneratedPalette) => {
    setIsPreviewingOriginal(false);
    setSelectedPreviewPalette(palette);
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        backgroundColor: theme.background,
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      <Header 
        onRandomColors={handleRandomColors} 
        theme={theme} 
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Notifications */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 shadow-xl shadow-red-100/50">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-full transition-colors">
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-xl shadow-green-100/50">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="p-1 hover:bg-green-100 rounded-full transition-colors">
              <X className="w-4 h-4 text-green-400" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero / Input Section */}
        {!hasResult && (
          <div className="text-center space-y-8 py-8">
            <div className="space-y-4">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm transition-all duration-500"
                style={{ backgroundColor: `${theme.surface}CC`, border: `1px solid ${theme.border}` }}
              >
                <span className="text-sm font-medium" style={{ color: theme.text }}>{t.heroBadge}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight" style={{ color: theme.text }}>
                {t.heroTitle1}
                <br />
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary}, ${theme.accent})` }}
                >
                  {t.heroTitle2}
                </span>
              </h2>
              <p className="max-w-xl mx-auto text-lg" style={{ color: theme.text, opacity: 0.7 }}>
                {t.heroSubtitle}
              </p>
            </div>

            {loading ? (
              <LoadingState language={language} theme={theme} />
            ) : (
              <div className="pt-2">
                <ImageUpload
                  onColorsExtracted={handleImageColorsExtracted}
                  onLoading={setLoading}
                  onError={handleError}
                  language={language}
                  theme={theme}
                />
              </div>
            )}

            {/* Demo button */}
            <div className="pt-4">
              <button
                onClick={handleDemo}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}
              >
                <Wand2 className="w-4 h-4" />
                {t.demoButton}
              </button>
              <p className="text-xs mt-3" style={{ color: theme.text, opacity: 0.6 }}>{t.demoSubtitle}</p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
              {[
                { title: t.feature1Title, desc: t.feature1Desc, color: theme.primary },
                { title: t.feature2Title, desc: t.feature2Desc, color: theme.secondary },
                { title: t.feature3Title, desc: t.feature3Desc, color: theme.accent },
              ].map((feature, i) => (
                <div 
                  key={feature.title} 
                  className="p-5 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                  style={{ 
                    backgroundColor: `${feature.color}15`,
                    borderColor: `${feature.color}30`
                  }}
                >
                  <h3 className="font-bold text-sm" style={{ color: theme.text }}>{feature.title}</h3>
                  <p className="text-xs mt-1.5" style={{ color: theme.text, opacity: 0.7 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {hasResult && (
          <div className="space-y-10">
            {/* Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium hover:shadow-md transition-all"
                style={{ 
                  backgroundColor: `${theme.surface}CC`,
                  border: `1px solid ${theme.border}`,
                  color: theme.text
                }}
              >
                {t.newAnalysis}
              </button>
            </div>

            {/* Original Palette */}
            {originalPalette && (
              <section 
                className="backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border transition-all duration-500"
                style={{ 
                  backgroundColor: `${theme.surface}CC`,
                  borderColor: theme.border
                }}
              >
                <PaletteDisplay
                  palette={originalPalette}
                  imageUrl={imageUrl || undefined}
                  onPreview={handlePreviewOriginal}
                  isPreviewing={isPreviewingOriginal}
                  theme={theme}
                  language={language}
                />
              </section>
            )}

            {/* Generated Palettes */}
            {generatedPalettes.length > 0 && (
              <section 
                className="backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border transition-all duration-500"
                style={{ 
                  backgroundColor: `${theme.surface}CC`,
                  borderColor: theme.border
                }}
              >
                <GeneratedPalettes
                  palettes={generatedPalettes}
                  onSelectPalette={handlePreviewGenerated}
                  selectedPaletteId={selectedPreviewPalette?.id}
                  theme={theme}
                  language={language}
                />
              </section>
            )}

            {/* Preview */}
            {previewColors.length > 0 && (
              <section 
                className="backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border transition-all duration-500"
                style={{ 
                  backgroundColor: `${theme.surface}CC`,
                  borderColor: theme.border
                }}
              >
                <PalettePreview colors={previewColors} paletteName={previewName} language={language} theme={theme} />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer 
        className="border-t mt-16 py-8 backdrop-blur-sm transition-all duration-500"
        style={{ 
          backgroundColor: `${theme.surface}80`,
          borderColor: theme.border
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm" style={{ color: theme.text, opacity: 0.6 }}>
            {t.footerText} <span style={{ color: theme.primary }}>♥</span> {isRTL ? '' : 'by'} <span className="font-medium" style={{ color: theme.text }}>zainabiscoding</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
