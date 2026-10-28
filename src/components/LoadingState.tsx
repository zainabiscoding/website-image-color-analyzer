import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 animate-pulse" />
      </div>
      <div className="text-center">
        <p className="font-medium text-gray-700">Analyzing image colors...</p>
        <p className="text-sm text-gray-400 mt-1">Extracting dominant colors using Canvas API</p>
      </div>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-violet-300 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
