import { useState } from 'react';
import { Shuffle, Palette as PaletteIcon, X } from 'lucide-react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
  border: string;
}

interface HeaderProps {
  onRandomColors: () => void;
  theme: ThemeColors;
}

export default function Header({ onRandomColors, theme }: HeaderProps) {
  const [showColorDetails, setShowColorDetails] = useState(false);

  const handleRandomClick = () => {
    onRandomColors();
  };

  return (
    <>
      <header 
        className="backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-500"
        style={{ backgroundColor: `${theme.surface}E6`, borderColor: theme.border }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{ 
                fontFamily: 'Caveat, cursive',
                backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary}, ${theme.accent})`
              }}
            >
              Palettee
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}
              title="Generate random colors"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Random</span>
            </button>
            
            <button
              onClick={() => setShowColorDetails(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200"
              style={{ 
                backgroundColor: theme.surface,
                border: `2px solid ${theme.border}`,
                color: theme.text
              }}
              title="Show color details"
            >
              <PaletteIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Colors</span>
            </button>
          </div>
        </div>
      </header>

      {/* Color Details Modal */}
      {showColorDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" style={{ backgroundColor: theme.surface }}>
            <div 
              className="sticky top-0 border-b px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}
            >
              <h2 className="text-xl font-bold" style={{ color: theme.text }}>Interface Colors</h2>
              <button
                onClick={() => setShowColorDetails(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: theme.text }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                  <div className="w-12 h-12 rounded-lg shadow-md flex-shrink-0" style={{ backgroundColor: theme.primary }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.text }}>Primary</p>
                    <p className="text-xs font-mono" style={{ color: theme.text, opacity: 0.6 }}>{theme.primary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                  <div className="w-12 h-12 rounded-lg shadow-md flex-shrink-0" style={{ backgroundColor: theme.secondary }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.text }}>Secondary</p>
                    <p className="text-xs font-mono" style={{ color: theme.text, opacity: 0.6 }}>{theme.secondary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                  <div className="w-12 h-12 rounded-lg shadow-md flex-shrink-0" style={{ backgroundColor: theme.accent }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.text }}>Accent</p>
                    <p className="text-xs font-mono" style={{ color: theme.text, opacity: 0.6 }}>{theme.accent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                  <div className="w-12 h-12 rounded-lg shadow-md flex-shrink-0 border" style={{ backgroundColor: theme.background, borderColor: theme.border }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.text }}>Background</p>
                    <p className="text-xs font-mono" style={{ color: theme.text, opacity: 0.6 }}>{theme.background}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                  <div className="w-12 h-12 rounded-lg shadow-md flex-shrink-0" style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.text }}>Surface</p>
                    <p className="text-xs font-mono" style={{ color: theme.text, opacity: 0.6 }}>{theme.surface}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                  <div className="w-12 h-12 rounded-lg shadow-md flex-shrink-0" style={{ backgroundColor: theme.border }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.text }}>Border</p>
                    <p className="text-xs font-mono" style={{ color: theme.text, opacity: 0.6 }}>{theme.border}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: theme.background }}>
                <p className="text-sm" style={{ color: theme.text, opacity: 0.7 }}>
                  These are the current interface colors. Click "Random" to generate new color combinations!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
