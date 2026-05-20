import type { Metadata } from "next";
import Link from "next/link";
import {
  getMockCricketMatches,
  getMockFootballMatches,
  getMockMovies,
  getMockShows,
} from "@/lib/api/sports";

export const metadata: Metadata = {
  title: "LiveStreamTV.pk — Live Cricket, Football Scores & Streaming Guide",
  description:
    "Watch live cricket scores, football results, and find where to stream movies & TV shows. Pakistan's #1 sports and entertainment hub.",
};

const countryFlags: Record<string, string> = {
  Pakistan: "🇵🇰",
  India: "🇮🇳",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Australia: "🇦🇺",
  "South Africa": "🇿🇦",
  "New Zealand": "🇳🇿",
  "West Indies": "🏝️",
  "Sri Lanka": "🇱🇰",
};

const movieGradients = [
  "from-red-950 to-orange-950",
  "from-blue-950 to-indigo-950",
  "from-purple-950 to-pink-950",
  "from-green-950 to-teal-950",
  "from-amber-950 to-yellow-950",
  "from-cyan-950 to-blue-950",
];

const showGradients = [
  "from-indigo-950 to-purple-950",
  "from-red-950 to-rose-950",
  "from-teal-950 to-green-950",
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

const features = [
  {
    emoji: "🏏",
    title: "Live Cricket",
    desc: "Ball-by-ball updates for Asia Cup, World Cup, Test Series and T20 leagues worldwide.",
    href: "/cricket",
    accent: "#10b981",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.15)",
  },
  {
    emoji: "⚽",
    title: "Football Scores",
    desc: "Real-time scores from Premier League, La Liga, Champions League and 100+ competitions.",
    href: "/football",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.15)",
  },
  {
    emoji: "🎬",
    title: "Movies Guide",
    desc: "Instantly find which streaming platform hosts any movie — Netflix, Disney+, and more.",
    href: "/movies",
    accent: "#ec4899",
    bg: "rgba(236,72,153,0.06)",
    border: "rgba(236,72,153,0.15)",
  },
  {
    emoji: "📡",
    title: "Live TV",
    desc: "100+ free live TV channels — sports, news, entertainment from Pakistan and worldwide.",
    href: "/live-tv",
    accent: "#7c3aed",
    bg: "rgba(124,58,237,0.06)",
    border: "rgba(124,58,237,0.15)",
  },
];

const stats = [
  { value: "50+", label: "Live Matches / Day" },
  { value: "10K+", label: "Movies & Shows" },
  { value: "100+", label: "Live TV Channels" },
];

export default function Home() {
  const cricketMatches = getMockCricketMatches().filter((m) => m.status === "live");
  const footballMatches = getMockFootballMatches().filter((m) => m.status === "live");
  const movies = getMockMovies().slice(0, 6);
  const shows = getMockShows().slice(0, 3);

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        aria-label="Hero"
      >
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 40% 40% at 20% 60%, rgba(96,165,250,0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <span className="live-dot w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
            <span className="text-xs font-bold text-red-400 tracking-wider">LIVE NOW</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-4">
            Watch Every
            <br />
            <span className="gradient-text">Live Match</span>
            <br />
            <span className="text-white">& Stream Anything.</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "#9ca3af" }}>
            Pakistan&apos;s #1 hub for live cricket scores, football results, and the definitive
            guide to movies &amp; TV shows — all in one place, always free.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/cricket"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              🏏 Live Cricket
            </Link>
            <Link
              href="/movies"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e1e2e",
                color: "#fff",
              }}
            >
              🎬 Streaming Guide
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black gradient-text">{s.value}</div>
                <div className="text-xs md:text-sm mt-1" style={{ color: "#9ca3af" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE NOW ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16" aria-label="Live matches">
        <div className="section-divider mb-12" />

        <div className="flex items-center gap-3 mb-8">
          <span className="live-dot w-3 h-3 bg-red-500 rounded-full" aria-hidden="true" />
          <h2 className="text-2xl font-black text-white">Live Now</h2>
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-8" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Cricket live cards */}
          {cricketMatches.map((match) => (
            <Link
              key={match.id}
              href="/cricket"
              className="block card-hover rounded-xl p-5 cursor-pointer"
              style={{ background: "#141422", border: "1px solid #1e1e2e" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }}
                >
                  <span className="live-dot w-1.5 h-1.5 bg-red-400 rounded-full" />
                  LIVE
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}
                >
                  {match.format}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-2 mb-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    {countryFlags[match.teams.home.name] ?? ""} {match.teams.home.name}
                  </p>
                  <p className="text-xl font-black" style={{ color: "#10b981" }}>
                    {match.teams.home.score}
                  </p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    {match.teams.home.overs} ov
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black" style={{ color: "#9ca3af" }}>
                    VS
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {match.teams.away.name} {countryFlags[match.teams.away.name] ?? ""}
                  </p>
                  <p className="text-xl font-black" style={{ color: "#d1d5db" }}>
                    {match.teams.away.score}
                  </p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    {match.teams.away.overs} ov
                  </p>
                </div>
              </div>
              <p className="text-xs truncate" style={{ color: "#9ca3af" }}>
                🏆 {match.tournament}
              </p>
            </Link>
          ))}

          {/* Football live cards */}
          {footballMatches.map((match) => (
            <Link
              key={match.id}
              href="/football"
              className="block card-hover rounded-xl p-5 cursor-pointer"
              style={{ background: "#141422", border: "1px solid #1e1e2e" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold" style={{ color: "#fcd34d" }}>
                  {match.leagueLogo} {match.league}
                </span>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#34d399",
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full live-dot" />
                  {match.minute}&apos;
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <p className="text-sm font-bold text-white">{match.homeTeam}</p>
                <div
                  className="text-center py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <span className="text-2xl font-black text-white">
                    {match.homeScore} – {match.awayScore}
                  </span>
                </div>
                <p className="text-sm font-bold text-white text-right">{match.awayTeam}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16" aria-label="Features">
        <div className="section-divider mb-12" />
        <h2 className="text-2xl font-black text-white mb-8">What We Cover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="block card-hover rounded-xl p-6 group"
              style={{
                background: f.bg,
                border: `1px solid ${f.border}`,
              }}
            >
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                {f.desc}
              </p>
              <div
                className="mt-4 text-xs font-bold inline-flex items-center gap-1"
                style={{ color: f.accent }}
              >
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRENDING MOVIES ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16" aria-label="Trending movies">
        <div className="section-divider mb-12" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">
            🎬 Trending <span className="gradient-text-pink">Movies</span>
          </h2>
          <Link href="/movies" className="text-sm font-semibold" style={{ color: "#a78bfa" }}>
            View all →
          </Link>
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-8" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {movies.map((movie, i) => (
            <Link
              key={movie.id}
              href="/movies"
              className="group block card-hover"
            >
              <div
                className={`relative aspect-[2/3] rounded-xl bg-gradient-to-br ${movieGradients[i % movieGradients.length]} mb-3 overflow-hidden`}
                style={{ border: "1px solid #1e1e2e" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-3xl mb-1" aria-hidden="true">🎬</span>
                  <span className="text-white text-xs font-bold leading-tight">{movie.title}</span>
                </div>
                <div
                  className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                  style={{ background: "rgba(0,0,0,0.65)" }}
                >
                  <span className="text-amber-400" aria-hidden="true" style={{ fontSize: "10px" }}>★</span>
                  <span className="text-white font-bold" style={{ fontSize: "10px" }}>
                    {movie.vote_average}
                  </span>
                </div>
              </div>
              <p className="text-xs font-semibold text-white truncate mb-1">{movie.title}</p>
              <p className="text-xs mb-1.5" style={{ color: "#9ca3af" }}>
                {movie.genre} · {new Date(movie.release_date).getFullYear()}
              </p>
              <div className="flex flex-wrap gap-1">
                {movie.streaming.slice(0, 2).map((s) => (
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
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRENDING SHOWS ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20" aria-label="Trending TV shows">
        <div className="section-divider mb-12" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">
            📺 Trending <span className="gradient-text">TV Shows</span>
          </h2>
          <Link href="/tv-shows" className="text-sm font-semibold" style={{ color: "#a78bfa" }}>
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {shows.map((show, i) => (
            <Link
              key={show.id}
              href="/tv-shows"
              className="block card-hover rounded-xl overflow-hidden group"
              style={{ background: "#141422", border: "1px solid #1e1e2e" }}
            >
              <div
                className={`h-28 bg-gradient-to-br ${showGradients[i % showGradients.length]} flex items-center justify-center relative`}
              >
                <span className="text-5xl" aria-hidden="true">📺</span>
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
                />
                <div className="absolute bottom-3 left-4 flex items-center gap-1">
                  <span className="text-amber-400" style={{ fontSize: "13px" }} aria-hidden="true">★</span>
                  <span className="text-sm font-bold text-white">{show.vote_average}</span>
                </div>
              </div>
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
                        padding: "2px 8px",
                        background: streamingColors[s] ?? "#374151",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom ad slot */}
        <div className="ad-slot mt-12" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>
      </section>
    </>
  );
}
