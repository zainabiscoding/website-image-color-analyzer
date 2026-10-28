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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [originalPalette, setOriginalPalette] = useState<Palette | null>(null);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [selectedPreviewPalette, setSelectedPreviewPalette] = useState<GeneratedPalette | null>(null);
  const [isPreviewingOriginal, setIsPreviewingOriginal] = useState(true);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-pink-50/30 to-purple-50/40">
      <Header />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-pink-100 shadow-sm">
                <span className="text-lg">🎨</span>
                <span className="text-sm font-medium text-gray-700">Extract • Generate • Preview</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Discover Beautiful
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Color Palettes
                </span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-lg">
                Upload an image and watch the magic happen ✨
              </p>
            </div>

            {loading ? (
              <LoadingState />
            ) : (
              <div className="pt-2">
                <ImageUpload
                  onColorsExtracted={handleImageColorsExtracted}
                  onLoading={setLoading}
                  onError={handleError}
                />
              </div>
            )}

            {/* Demo button */}
            <div className="pt-4">
              <button
                onClick={handleDemo}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 text-white font-medium shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50 hover:scale-105 transition-all duration-200 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                Try Demo Palette
              </button>
              <p className="text-xs text-gray-500 mt-3">✨ No upload needed — explore with a sample palette</p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
              {[
                { icon: '🖼️', title: 'Upload Image', desc: 'Drop any image to extract its colors', color: 'from-orange-100 to-orange-50' },
                { icon: '✨', title: 'Generate Variations', desc: '6 harmony styles for creative ideas', color: 'from-pink-100 to-pink-50' },
                { icon: '🎯', title: 'Preview & Export', desc: 'See it in action, copy as CSS or JSON', color: 'from-purple-100 to-purple-50' },
              ].map((feature) => (
                <div key={feature.title} className={`p-5 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600 mt-1.5">{feature.desc}</p>
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
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-md transition-all"
              >
                ← New Analysis
              </button>
            </div>

            {/* Original Palette */}
            {originalPalette && (
              <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg shadow-pink-100/30 border border-white/80">
                <PaletteDisplay
                  palette={originalPalette}
                  imageUrl={imageUrl || undefined}
                  onPreview={handlePreviewOriginal}
                  isPreviewing={isPreviewingOriginal}
                />
              </section>
            )}

            {/* Generated Palettes */}
            {generatedPalettes.length > 0 && (
              <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg shadow-purple-100/30 border border-white/80">
                <GeneratedPalettes
                  palettes={generatedPalettes}
                  onSelectPalette={handlePreviewGenerated}
                  selectedPaletteId={selectedPreviewPalette?.id}
                />
              </section>
            )}

            {/* Preview */}
            {previewColors.length > 0 && (
              <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg shadow-orange-100/30 border border-white/80">
                <PalettePreview colors={previewColors} paletteName={previewName} />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            Made with <span className="text-pink-500">♥</span> • PaletteCraft
          </p>
        </div>
      </footer>
    </div>
  );
}
