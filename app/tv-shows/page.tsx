import type { Metadata } from "next";
import Link from "next/link";
import { getMockShows } from "@/lib/api/sports";

export const metadata: Metadata = {
  title: "Best TV Shows Streaming Guide",
  description:
    "Find the best TV shows streaming on Netflix, HBO Max, Disney+, and Amazon Prime. Top-rated series updated weekly.",
};

const genres = ["All", "Drama", "Sci-Fi", "Action", "Comedy", "Crime", "Fantasy", "Horror"];

const streamingColors: Record<string, string> = {
  Netflix: "#dc2626",
  "Disney+": "#1d4ed8",
  "Amazon Prime": "#d97706",
  "HBO Max": "#7e22ce",
  BBC: "#4b5563",
};

const posterGradients = [
  "from-indigo-950 to-purple-950",
  "from-red-950 to-rose-950",
  "from-teal-950 to-green-950",
  "from-orange-950 to-amber-950",
  "from-blue-950 to-cyan-950",
  "from-pink-950 to-fuchsia-950",
];

export default function TvShowsPage() {
  const shows = getMockShows();

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <span className="text-5xl block mb-4" aria-hidden="true">📺</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Best <span className="gradient-text">TV Shows</span> to Stream
          </h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: "#9ca3af" }}>
            Top-rated series across Netflix, HBO Max, Disney+, Amazon Prime and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Genre filter chips (visual only) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map((g, i) => (
            <span
              key={g}
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: i === 0 ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
                border: i === 0 ? "1px solid rgba(14,165,233,0.3)" : "1px solid #1e1e2e",
                color: i === 0 ? "#38bdf8" : "#9ca3af",
              }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-8" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* Shows grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {shows.map((show, i) => (
            <div
              key={show.id}
              className="card-hover rounded-xl overflow-hidden group"
              style={{ background: "#141422", border: "1px solid #1e1e2e" }}
            >
              {/* Show poster area */}
              <div
                className={`relative h-36 bg-gradient-to-br ${posterGradients[i % posterGradients.length]} flex items-center justify-center`}
              >
                <span className="text-5xl" aria-hidden="true">📺</span>
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(20,20,34,0.8), transparent)",
                  }}
                />
                {/* Rating */}
                <div className="absolute bottom-3 left-4 flex items-center gap-1">
                  <span className="text-amber-400" style={{ fontSize: "14px" }} aria-hidden="true">★</span>
                  <span className="text-sm font-bold text-white">{show.vote_average}</span>
                </div>
                {/* Streaming platform badges top-right */}
                <div className="absolute top-3 right-3 flex gap-1">
                  {show.streaming.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="text-white font-bold rounded"
                      style={{
                        fontSize: "9px",
                        padding: "2px 6px",
                        background: streamingColors[s] ?? "#374151",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-1 truncate">{show.name}</h3>
                <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
                  {show.genre} · {new Date(show.first_air_date).getFullYear()}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {show.streaming.map((s) => (
                    <span
                      key={s}
                      className="text-white font-bold rounded"
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
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
        <div className="ad-slot mb-12" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e1e2e",
              color: "#fff",
            }}
          >
            🎬 Also check Movies Guide →
          </Link>
        </div>
      </div>
    </div>
  );
}
