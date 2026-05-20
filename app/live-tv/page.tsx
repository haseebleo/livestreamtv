import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Live TV Channels Online",
  description:
    "Watch 100+ free live TV channels online from Pakistan, UK, US, India and worldwide. Sports, News, Entertainment and more.",
};

const channels = [
  { name: "Geo News", country: "🇵🇰", category: "News" },
  { name: "ARY News", country: "🇵🇰", category: "News" },
  { name: "PTV Sports", country: "🇵🇰", category: "Sports" },
  { name: "A Sports", country: "🇵🇰", category: "Sports" },
  { name: "BBC World", country: "🇬🇧", category: "News" },
  { name: "CNN International", country: "🇺🇸", category: "News" },
  { name: "Al Jazeera", country: "🇶🇦", category: "News" },
  { name: "Aaj Entertainment", country: "🇵🇰", category: "Entertainment" },
  { name: "Hum TV", country: "🇵🇰", category: "Entertainment" },
  { name: "Star Sports 1", country: "🇮🇳", category: "Sports" },
  { name: "Sky Sports", country: "🇬🇧", category: "Sports" },
  { name: "beIN Sports", country: "🇶🇦", category: "Sports" },
  { name: "ESPN", country: "🇺🇸", category: "Sports" },
  { name: "Discovery Channel", country: "🌍", category: "Documentary" },
  { name: "National Geographic", country: "🌍", category: "Documentary" },
  { name: "Cartoon Network", country: "🌍", category: "Kids" },
];

const categories = ["All", "Sports", "News", "Entertainment", "Documentary", "Kids"];

const categoryStyles: Record<string, { color: string; bg: string; border: string }> = {
  Sports: { color: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  News: { color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
  Entertainment: { color: "#f472b6", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)" },
  Documentary: { color: "#fcd34d", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  Kids: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
};

export default function LiveTvPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(239,68,68,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl" aria-hidden="true">📡</span>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              <span className="live-dot w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
              LIVE
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Free <span className="gradient-text">Live TV</span> Channels
          </h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: "#9ca3af" }}>
            100+ free live TV channels — Sports, News, Entertainment, Documentary and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Category filter chips (visual only) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c, i) => (
            <span
              key={c}
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: i === 0 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                border: i === 0 ? "1px solid rgba(239,68,68,0.3)" : "1px solid #1e1e2e",
                color: i === 0 ? "#f87171" : "#9ca3af",
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-8" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* Channel grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
          {channels.map((ch) => {
            const style = categoryStyles[ch.category] ?? categoryStyles.News;
            return (
              <div
                key={ch.name}
                className="card-hover rounded-xl p-5 cursor-pointer group"
                style={{ background: "#141422", border: "1px solid #1e1e2e" }}
              >
                {/* Icon row */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(96,165,250,0.2))",
                      border: "1px solid rgba(124,58,237,0.2)",
                    }}
                    aria-hidden="true"
                  >
                    📺
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171",
                    }}
                  >
                    <span className="live-dot w-1.5 h-1.5 bg-red-400 rounded-full" />
                    LIVE
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-white text-sm mb-2 truncate">{ch.name}</h3>

                {/* Category + country */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                  >
                    {ch.category}
                  </span>
                  <span className="text-base" aria-label={`Country: ${ch.country}`}>{ch.country}</span>
                </div>

                {/* Watch button */}
                <button
                  className="w-full py-1.5 rounded-lg text-white text-xs font-bold transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #dc2626, #ea580c)" }}
                >
                  ▶ Watch Now
                </button>
              </div>
            );
          })}
        </div>

        {/* Ad slot */}
        <div className="ad-slot" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/cricket"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e1e2e",
              color: "#fff",
            }}
          >
            🏏 Watch Live Cricket Scores →
          </Link>
        </div>
      </div>
    </div>
  );
}
