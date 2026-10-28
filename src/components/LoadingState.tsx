import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 flex items-center justify-center shadow-xl shadow-pink-200/50 animate-pulse">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 animate-bounce" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
      <div className="text-center space-y-2">
        <p className="font-bold text-xl text-gray-800">
          Extracting colors... 🎨
        </p>
        <p className="text-sm text-gray-500">
          Analyzing your image with magic ✨
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
