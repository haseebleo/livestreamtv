"use client";

import Link from "next/link";
import { Star, Play, ExternalLink } from "lucide-react";
import { getMockMovies, getMockShows } from "@/lib/api/sports";

const streamingColors: Record<string, string> = {
  Netflix: "bg-red-600",
  "Disney+": "bg-blue-600",
  "Amazon Prime": "bg-amber-600",
  "HBO Max": "bg-purple-700",
  "Paramount+": "bg-blue-500",
  "Apple TV+": "bg-gray-700",
  BBC: "bg-gray-600",
};

const moviePosters = [
  "from-red-900 to-orange-900",
  "from-blue-900 to-indigo-900",
  "from-purple-900 to-pink-900",
  "from-green-900 to-teal-900",
  "from-amber-900 to-yellow-900",
  "from-cyan-900 to-blue-900",
];

export default function TrendingContent() {
  const movies = getMockMovies();
  const shows = getMockShows();

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="section-divider mb-16" />

      {/* Trending Movies */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎬</span>
              <h2 className="text-2xl font-black text-white">Trending Movies</h2>
            </div>
            <p className="text-sm text-gray-400">Find where to stream them online</p>
          </div>
          <Link href="/movies" className="text-sm text-pink-400 hover:text-pink-300 font-medium">
            All movies →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {movies.map((movie, i) => (
            <Link key={movie.id} href="/movies">
              <div className="group cursor-pointer">
                <div className={`relative aspect-[2/3] rounded-xl bg-gradient-to-br ${moviePosters[i % moviePosters.length]} mb-3 overflow-hidden border border-white/5 group-hover:border-pink-500/30 transition-all`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <span className="text-3xl mb-2">🎬</span>
                    <span className="text-white text-xs font-bold leading-tight">{movie.title}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-white">{movie.vote_average}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white truncate mb-1">{movie.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {movie.streaming.slice(0, 2).map((s) => (
                      <span key={s} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${streamingColors[s] || "bg-gray-700"} text-white`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad slot */}
      <div className="ad-slot h-20 mb-16 rounded-xl">
        Advertisement — Google AdSense
      </div>

      {/* Trending Shows */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📺</span>
              <h2 className="text-2xl font-black text-white">Popular TV Shows</h2>
            </div>
            <p className="text-sm text-gray-400">Streaming now on your favorite platforms</p>
          </div>
          <Link href="/tv-shows" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
            All shows →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shows.map((show, i) => (
            <Link key={show.id} href="/tv-shows">
              <div className="glass rounded-2xl p-4 card-hover cursor-pointer border border-transparent hover:border-blue-500/30 flex gap-4">
                <div className={`w-16 h-20 rounded-lg bg-gradient-to-br ${moviePosters[(i + 3) % moviePosters.length]} flex-shrink-0 flex items-center justify-center`}>
                  <span className="text-2xl">📺</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm mb-1 truncate">{show.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{show.genre}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-amber-400">{show.vote_average}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {show.streaming.map((s) => (
                      <span key={s} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${streamingColors[s] || "bg-gray-700"} text-white`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0 self-start" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
