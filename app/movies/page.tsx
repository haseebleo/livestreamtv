import { getMockMovies } from "@/lib/api/sports";
import { Star, Play, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Movies Streaming Guide — Where to Watch | LiveStreamTV.pk",
  description: "Find where to stream any movie online. Netflix, Amazon Prime, Disney+, HBO Max and more. Updated daily.",
};

const streamingPlatforms = [
  { name: "Netflix", color: "bg-red-600", emoji: "🔴" },
  { name: "Disney+", color: "bg-blue-600", emoji: "🔵" },
  { name: "Amazon Prime", color: "bg-amber-600", emoji: "🟡" },
  { name: "HBO Max", color: "bg-purple-700", emoji: "🟣" },
  { name: "Paramount+", color: "bg-blue-500", emoji: "🔵" },
  { name: "Apple TV+", color: "bg-gray-700", emoji: "⬛" },
];

const streamingColors: Record<string, string> = {
  Netflix: "bg-red-600",
  "Disney+": "bg-blue-600",
  "Amazon Prime": "bg-amber-600",
  "HBO Max": "bg-purple-700",
  "Paramount+": "bg-blue-500",
  "Apple TV+": "bg-gray-700",
  BBC: "bg-gray-600",
};

const posterGradients = [
  "from-red-900 to-orange-900",
  "from-blue-900 to-indigo-900",
  "from-purple-900 to-pink-900",
  "from-green-900 to-teal-900",
  "from-amber-900 to-yellow-900",
  "from-cyan-900 to-blue-900",
];

export default function MoviesPage() {
  const movies = getMockMovies();

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(236,72,153,0.12) 0%, transparent 70%)" }} />
        <div className="relative">
          <span className="text-5xl block mb-4">🎬</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Movies <span className="gradient-text-pink">Streaming Guide</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Instantly find which platform streams any movie in your region
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Platform filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-sm font-semibold">
            All Platforms
          </button>
          {streamingPlatforms.map((p) => (
            <button key={p.name} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-pink-500/10 hover:border-pink-500/20 hover:text-pink-400 transition-all">
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot h-16 mb-8 rounded-xl">Advertisement</div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {movies.map((movie, i) => (
            <div key={movie.id} className="group cursor-pointer card-hover">
              <div className={`relative aspect-[2/3] rounded-xl bg-gradient-to-br ${posterGradients[i % posterGradients.length]} mb-3 overflow-hidden border border-white/5 group-hover:border-pink-500/30 transition-all`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-4xl mb-2">🎬</span>
                  <span className="text-white text-xs font-bold leading-tight">{movie.title}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-white">{movie.vote_average}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white truncate mb-1">{movie.title}</p>
                <p className="text-[10px] text-gray-500 mb-1.5">{movie.genre} · {new Date(movie.release_date).getFullYear()}</p>
                <div className="flex flex-wrap gap-1">
                  {movie.streaming.map((s) => (
                    <span key={s} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${streamingColors[s] || "bg-gray-700"} text-white`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot h-16 mb-8 rounded-xl">Advertisement</div>

        {/* Where to watch section */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-black text-white mb-6">Streaming Platforms Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {streamingPlatforms.map((platform) => (
              <div key={platform.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-pink-500/20 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-xl`}>
                  {platform.emoji}
                </div>
                <div>
                  <p className="font-bold text-white">{platform.name}</p>
                  <p className="text-xs text-gray-400">Stream movies & shows</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
