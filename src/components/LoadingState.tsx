import { Loader2 } from 'lucide-react';
import { translations, Language } from '../utils/translations';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
  border: string;
}

interface Props {
  language?: Language;
  theme?: ThemeColors;
}

export default function LoadingState({ language = 'en', theme }: Props) {
  const t = translations[language];
  
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl animate-pulse" style={{ background: `linear-gradient(135deg, ${theme?.primary || '#FF6B35'}, ${theme?.secondary || '#F7931E'}, ${theme?.accent || '#FFC857'})` }}>
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 animate-bounce" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
      <div className="text-center space-y-2">
        <p className="font-bold text-xl" style={{ color: theme?.text || '#1F2937' }}>
          {t.loadingTitle}
        </p>
        <p className="text-sm" style={{ color: theme?.text, opacity: 0.6 }}>
          {t.loadingSubtitle}
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
