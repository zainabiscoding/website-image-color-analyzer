import { useState } from 'react';
import { Shuffle, Palette as PaletteIcon, X } from 'lucide-react';

interface HeaderProps {
  onRandomColors: () => void;
}

export default function Header({ onRandomColors }: HeaderProps) {
  const [showColorDetails, setShowColorDetails] = useState(false);

  const handleRandomClick = () => {
    console.log('Random button clicked!');
    onRandomColors();
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Palette
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              title="Generate random colors"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Random</span>
            </button>
            
            <button
              onClick={() => setShowColorDetails(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-medium hover:border-purple-400 hover:shadow-md transition-all duration-200"
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Interface Colors</h2>
              <button
                onClick={() => setShowColorDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: '#FF6B35' }} />
                    <div>
                      <p className="font-semibold text-sm">Primary Orange</p>
                      <p className="text-xs text-gray-500">#FF6B35</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: '#FF1493' }} />
                    <div>
                      <p className="font-semibold text-sm">Primary Pink</p>
                      <p className="text-xs text-gray-500">#FF1493</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: '#9333EA' }} />
                    <div>
                      <p className="font-semibold text-sm">Primary Purple</p>
                      <p className="text-xs text-gray-500">#9333EA</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: '#FFF7ED' }} />
                    <div>
                      <p className="font-semibold text-sm">Background</p>
                      <p className="text-xs text-gray-500">#FFF7ED</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
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
