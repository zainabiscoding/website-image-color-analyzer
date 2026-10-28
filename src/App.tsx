import { useState, useCallback } from 'react';
import { AlertCircle, X, CheckCircle2, Wand2 } from 'lucide-react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ImageUpload from './components/ImageUpload';
import WebsiteInput from './components/WebsiteInput';
import PaletteDisplay from './components/PaletteDisplay';
import GeneratedPalettes from './components/GeneratedPalettes';
import PalettePreview from './components/PalettePreview';
import LoadingState from './components/LoadingState';
import { AnalysisMode, Palette, GeneratedPalette, PaletteColor } from './types';
import { generateAllPalettes } from './utils/paletteGeneration';
import { hexToRgb, rgbToHsl } from './utils/colorUtils';
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

export default function App() {
  const [mode, setMode] = useState<AnalysisMode>('image');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [originalPalette, setOriginalPalette] = useState<Palette | null>(null);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [selectedPreviewPalette, setSelectedPreviewPalette] = useState<GeneratedPalette | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

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
    setSuccessMessage('Colors extracted successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  const handleWebsitePaletteReady = useCallback((palette: Palette) => {
    setOriginalPalette(palette);
    setImageUrl(null);
    const generated = generateAllPalettes(palette.colors, palette.id, 'website');
    setGeneratedPalettes(generated);
    setSelectedPreviewPalette(generated[0] || null);
    setHasResult(true);
    setSuccessMessage('Website colors analyzed successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

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
      setSuccessMessage('Demo palette loaded! Explore the colors and generated palettes.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 800);
  }, []);

  const handleReset = () => {
    setOriginalPalette(null);
    setGeneratedPalettes([]);
    setSelectedPreviewPalette(null);
    setImageUrl(null);
    setHasResult(false);
    setError(null);
  };

  const previewColors = selectedPreviewPalette?.colors || originalPalette?.colors || [];
  const previewName = selectedPreviewPalette?.name || originalPalette?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      <Header />

      {/* Notifications */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 border border-red-200 shadow-lg shadow-red-100/50">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-md">
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-50 border border-green-200 shadow-lg shadow-green-100/50">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="p-1 hover:bg-green-100 rounded-md">
              <X className="w-4 h-4 text-green-400" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero / Input Section */}
        {!hasResult && (
          <div className="text-center space-y-8 py-8">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Discover & Generate
                <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"> Color Palettes</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Extract colors from images or websites, generate harmonious alternatives, and preview them in action.
              </p>
            </div>

            <ModeSelector selectedMode={mode} onSelectMode={setMode} />

            {loading ? (
              <LoadingState mode={mode} />
            ) : (
              <div className="pt-2">
                {mode === 'image' ? (
                  <ImageUpload
                    onColorsExtracted={handleImageColorsExtracted}
                    onLoading={setLoading}
                    onError={handleError}
                  />
                ) : (
                  <WebsiteInput
                    onPaletteReady={handleWebsitePaletteReady}
                    onLoading={setLoading}
                    onError={handleError}
                  />
                )}
              </div>
            )}

            {/* Demo button */}
            <div className="pt-4">
              <button
                onClick={handleDemo}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-300/50 transition-all duration-200 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                Try Demo Palette
              </button>
              <p className="text-xs text-gray-400 mt-2">No upload needed — explore with a sample palette</p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-3xl mx-auto">
              {[
                { icon: '🎨', title: 'Extract Colors', desc: 'From images or websites using Canvas API' },
                { icon: '✨', title: 'Generate Palettes', desc: '6 harmony styles for creative variations' },
                { icon: '📋', title: 'Export & Use', desc: 'Copy as CSS, JSON, or Tailwind config' },
              ].map((feature) => (
                <div key={feature.title} className="p-4 rounded-xl bg-white/60 border border-gray-100">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
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
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors"
              >
                ← Start New Analysis
              </button>
              <div className="flex items-center gap-2">
                <ModeSelector selectedMode={mode} onSelectMode={(newMode) => {
                  handleReset();
                  setMode(newMode);
                }} />
              </div>
            </div>

            {/* Original Palette */}
            {originalPalette && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <PaletteDisplay palette={originalPalette} imageUrl={imageUrl || undefined} />
              </section>
            )}

            {/* Generated Palettes */}
            {generatedPalettes.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <GeneratedPalettes
                  palettes={generatedPalettes}
                  onSelectPalette={setSelectedPreviewPalette}
                  selectedPaletteId={selectedPreviewPalette?.id}
                />
              </section>
            )}

            {/* Preview */}
            {previewColors.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <PalettePreview colors={previewColors} paletteName={previewName} />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            PaletteCraft — Color Analysis & Palette Generator • Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
