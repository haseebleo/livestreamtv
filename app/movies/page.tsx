import type { Metadata } from "next";
import Link from "next/link";
import { getMockMovies } from "@/lib/api/sports";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Movies Streaming Guide — Where to Watch",
  description:
    "Find where to stream any movie online. Netflix, Amazon Prime, Disney+, HBO Max and more. Updated daily.",
};

const streamingPlatforms = [
  { name: "Netflix", color: "#dc2626", emoji: "🔴", desc: "Stream movies & original series" },
  { name: "Disney+", color: "#1d4ed8", emoji: "🏰", desc: "Disney, Marvel, Star Wars & more" },
  { name: "Amazon Prime", color: "#d97706", emoji: "📦", desc: "Prime Originals and more" },
  { name: "HBO Max", color: "#7e22ce", emoji: "🎭", desc: "HBO originals, DC, Warner" },
  { name: "Paramount+", color: "#2563eb", emoji: "⛰️", desc: "CBS, Paramount originals" },
  { name: "Apple TV+", color: "#374151", emoji: "🍎", desc: "Apple original films & series" },
];

const platformFilterPills = [
  "All",
  "Netflix",
  "Disney+",
  "Amazon Prime",
  "HBO Max",
];

const streamingColors: Record<string, string> = {
  Netflix: "#dc2626",
  "Disney+": "#1d4ed8",
  "Amazon Prime": "#d97706",
  "HBO Max": "#7e22ce",
  "Paramount+": "#2563eb",
  "Apple TV+": "#374151",
  BBC: "#4b5563",
};

const posterGradients = [
  "from-red-950 to-orange-950",
  "from-blue-950 to-indigo-950",
  "from-purple-950 to-pink-950",
  "from-green-950 to-teal-950",
  "from-amber-950 to-yellow-950",
  "from-cyan-950 to-blue-950",
];

export default function MoviesPage() {
  const movies = getMockMovies();

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(236,72,153,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <span className="text-5xl block mb-4" aria-hidden="true">🎬</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Movies <span className="gradient-text-pink">Streaming Guide</span>
          </h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: "#9ca3af" }}>
            Instantly find which platform streams any movie in your region — updated daily
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Platform filter chips (visual only) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {platformFilterPills.map((p, i) => (
            <span
              key={p}
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: i === 0 ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.04)",
                border: i === 0 ? "1px solid rgba(236,72,153,0.3)" : "1px solid #1e1e2e",
                color: i === 0 ? "#f472b6" : "#9ca3af",
              }}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-8" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* Movies grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-14">
          {movies.map((movie, i) => (
            <div key={movie.id} className="group cursor-pointer card-hover">
              <div
                className={`relative aspect-[2/3] rounded-xl bg-gradient-to-br ${posterGradients[i % posterGradients.length]} mb-3 overflow-hidden`}
                style={{ border: "1px solid #1e1e2e" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-4xl mb-2" aria-hidden="true">🎬</span>
                  <span className="text-white text-xs font-bold leading-tight">{movie.title}</span>
                </div>
                {/* Rating badge */}
                <div
                  className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                  style={{ background: "rgba(0,0,0,0.7)" }}
                >
                  <span className="text-amber-400" style={{ fontSize: "10px" }} aria-hidden="true">★</span>
                  <span className="text-white font-bold" style={{ fontSize: "10px" }}>
                    {movie.vote_average}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white truncate mb-1">{movie.title}</p>
                <p className="mb-1.5" style={{ fontSize: "10px", color: "#9ca3af" }}>
                  {movie.genre} · {new Date(movie.release_date).getFullYear()}
                </p>
                <div className="flex flex-wrap gap-1">
                  {movie.streaming.map((s) => (
                    <span
                      key={s}
                      className="text-white font-bold rounded"
                      style={{
                        fontSize: "9px",
                        padding: "2px 5px",
                        background: streamingColors[s] ?? "#374151",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-14" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* Where to Watch section */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">Where to Watch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {streamingPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-4 p-4 rounded-xl card-hover"
                style={{ background: "#141422", border: "1px solid #1e1e2e" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: platform.color }}
                  aria-hidden="true"
                >
                  {platform.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white">{platform.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{platform.desc}</p>
                </div>
                <ExternalLink
                  className="w-4 h-4 flex-shrink-0 ml-auto"
                  style={{ color: "#9ca3af" }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/tv-shows"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e1e2e",
              color: "#fff",
            }}
          >
            📺 Also check TV Shows →
          </Link>
        </div>
      </div>
    </div>
  );
}
