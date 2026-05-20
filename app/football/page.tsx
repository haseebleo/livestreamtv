import type { Metadata } from "next";
import Link from "next/link";
import { getMockFootballMatches } from "@/lib/api/sports";

export const metadata: Metadata = {
  title: "Live Football Scores & Results",
  description:
    "Live football scores from Premier League, La Liga, Champions League, Bundesliga and more. Real-time updates.",
};

const leagues = [
  { name: "All Leagues", flag: "" },
  { name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "La Liga", flag: "🇪🇸" },
  { name: "Bundesliga", flag: "🇩🇪" },
  { name: "Serie A", flag: "🇮🇹" },
  { name: "Ligue 1", flag: "🇫🇷" },
  { name: "UCL", flag: "🏆" },
];

export default function FootballPage() {
  const matches = getMockFootballMatches();
  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const completed = matches.filter((m) => m.status === "completed");

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <span className="text-5xl block mb-4" aria-hidden="true">⚽</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Live <span className="gradient-text-amber">Football</span> Scores
          </h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: "#9ca3af" }}>
            Real-time scores from Premier League, La Liga, Champions League and 100+ competitions
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* League filter chips (visual only) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {leagues.map((l, i) => (
            <span
              key={l.name}
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: i === 0 ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                border: i === 0 ? "1px solid rgba(245,158,11,0.3)" : "1px solid #1e1e2e",
                color: i === 0 ? "#fcd34d" : "#9ca3af",
              }}
            >
              {l.flag && `${l.flag} `}{l.name}
            </span>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-8" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* ── LIVE MATCHES ── */}
        {live.length > 0 && (
          <section className="mb-12" aria-label="Live football matches">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="live-dot w-2.5 h-2.5 bg-red-500 rounded-full" aria-hidden="true" />
              <h2 className="text-xl font-black text-white">Live Matches</h2>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                {live.length} LIVE
              </span>
            </div>
            <div className="space-y-4">
              {live.map((match) => (
                <div
                  key={match.id}
                  className="card-hover rounded-xl p-6"
                  style={{ background: "#141422", border: "1px solid rgba(245,158,11,0.15)" }}
                >
                  {/* League + minute */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-semibold" style={{ color: "#fcd34d" }}>
                      {match.leagueLogo} {match.league}
                    </span>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        color: "#34d399",
                      }}
                    >
                      <span className="live-dot w-1.5 h-1.5 bg-green-400 rounded-full" />
                      {match.minute}&apos;
                    </div>
                  </div>

                  {/* Score row */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div>
                      <p className="text-base font-bold text-white leading-tight">{match.homeTeam}</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e" }}
                      >
                        <span className="text-3xl font-black text-white">{match.homeScore}</span>
                        <span className="font-bold" style={{ color: "#9ca3af" }}>–</span>
                        <span className="text-3xl font-black text-white">{match.awayScore}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-white leading-tight">{match.awayTeam}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── UPCOMING FIXTURES ── */}
        {upcoming.length > 0 && (
          <section className="mb-12" aria-label="Upcoming football fixtures">
            <h2 className="text-xl font-black text-white mb-6">📅 Upcoming Fixtures</h2>
            <div className="space-y-3">
              {upcoming.map((match) => (
                <div
                  key={match.id}
                  className="card-hover rounded-xl p-5"
                  style={{ background: "#141422", border: "1px solid rgba(96,165,250,0.15)" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
                        {match.leagueLogo} {match.league}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: "#60a5fa" }}>
                        Today {match.kickoff}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ad slot */}
        <div className="ad-slot mb-12" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* ── FULL TIME RESULTS ── */}
        {completed.length > 0 && (
          <section aria-label="Full time results">
            <h2 className="text-xl font-black text-white mb-6">Full Time Results</h2>
            <div className="space-y-3">
              {completed.map((match) => (
                <div
                  key={match.id}
                  className="card-hover rounded-xl p-5"
                  style={{
                    background: "#141422",
                    border: "1px solid #1e1e2e",
                    opacity: 0.8,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
                        {match.leagueLogo} {match.league}
                      </p>
                    </div>
                    <p className="text-xl font-black text-white">
                      {match.homeScore} – {match.awayScore}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
            🏏 Also check Cricket Scores →
          </Link>
        </div>
      </div>
    </div>
  );
}
