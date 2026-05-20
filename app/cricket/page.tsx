import type { Metadata } from "next";
import Link from "next/link";
import { getMockCricketMatches } from "@/lib/api/sports";
import { MapPin, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Cricket Scores & Schedules",
  description:
    "Live cricket scores, ball-by-ball commentary, and match schedules for Asia Cup, ICC World Cup, Test Series and T20 leagues worldwide.",
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

const formatStyles: Record<string, { color: string; bg: string; border: string }> = {
  ODI: { color: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  T20: { color: "#a78bfa", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)" },
  Test: { color: "#fcd34d", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
};

export default function CricketPage() {
  const matches = getMockCricketMatches();
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
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <span className="text-5xl block mb-4" aria-hidden="true">🏏</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Live <span className="gradient-text-green">Cricket</span> Scores
          </h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: "#9ca3af" }}>
            Ball-by-ball updates from every major cricket match worldwide
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* Filter chips (visual only — Server Component) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Live", "Upcoming", "Completed"].map((tab, i) => (
            <span
              key={tab}
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: i === 0 ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                border: i === 0 ? "1px solid rgba(16,185,129,0.3)" : "1px solid #1e1e2e",
                color: i === 0 ? "#34d399" : "#9ca3af",
              }}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot mb-8" style={{ height: "90px" }}>
          Advertisement — Google AdSense
        </div>

        {/* ── LIVE MATCHES ── */}
        {live.length > 0 && (
          <section className="mb-12" aria-label="Live cricket matches">
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
              {live.map((match) => {
                const fmt = formatStyles[match.format] ?? formatStyles.ODI;
                return (
                  <div
                    key={match.id}
                    className="card-hover rounded-xl p-6"
                    style={{ background: "#141422", border: "1px solid rgba(16,185,129,0.15)" }}
                  >
                    {/* Top row */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
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
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: fmt.bg, border: `1px solid ${fmt.border}`, color: fmt.color }}
                      >
                        {match.format}
                      </span>
                      <div
                        className="ml-auto flex items-center gap-1.5 text-sm"
                        style={{ color: "#9ca3af" }}
                      >
                        <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
                        {match.tournament}
                      </div>
                    </div>

                    {/* Score grid */}
                    <div className="grid grid-cols-3 items-center gap-4 mb-5">
                      <div>
                        <p className="text-xl font-black text-white mb-1">
                          {countryFlags[match.teams.home.name] ?? ""} {match.teams.home.name}
                        </p>
                        <p className="text-3xl font-black" style={{ color: "#10b981" }}>
                          {match.teams.home.score}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                          {match.teams.home.overs} overs
                        </p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1e1e2e" }}
                        >
                          <span className="text-sm font-black" style={{ color: "#9ca3af" }}>VS</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white mb-1">
                          {match.teams.away.name} {countryFlags[match.teams.away.name] ?? ""}
                        </p>
                        <p className="text-3xl font-black" style={{ color: "#d1d5db" }}>
                          {match.teams.away.score}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                          {match.teams.away.overs} overs
                        </p>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div
                      className="flex items-center gap-2 pt-4 text-xs"
                      style={{ borderTop: "1px solid #1e1e2e", color: "#9ca3af" }}
                    >
                      <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                      {match.venue}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── UPCOMING MATCHES ── */}
        {upcoming.length > 0 && (
          <section className="mb-12" aria-label="Upcoming cricket matches">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <span style={{ color: "#60a5fa" }}>🕐</span> Upcoming Matches
            </h2>
            <div className="space-y-3">
              {upcoming.map((match) => (
                <div
                  key={match.id}
                  className="card-hover rounded-xl p-5"
                  style={{ background: "#141422", border: "1px solid rgba(96,165,250,0.15)" }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        {countryFlags[match.teams.home.name] ?? ""} {match.teams.home.name}{" "}
                        <span style={{ color: "#9ca3af" }}>vs</span>{" "}
                        {match.teams.away.name} {countryFlags[match.teams.away.name] ?? ""}
                      </p>
                      <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                        {match.tournament} &middot; {match.format}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: "#60a5fa" }}>
                        {match.startTime}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                        {match.venue}
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

        {/* ── RECENT RESULTS ── */}
        {completed.length > 0 && (
          <section aria-label="Recent cricket results">
            <h2 className="text-xl font-black text-white mb-6">Recent Results</h2>
            <div className="space-y-3">
              {completed.map((match) => (
                <div
                  key={match.id}
                  className="card-hover rounded-xl p-5"
                  style={{
                    background: "#141422",
                    border: "1px solid #1e1e2e",
                    opacity: 0.85,
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        {countryFlags[match.teams.home.name] ?? ""} {match.teams.home.name}{" "}
                        vs {match.teams.away.name} {countryFlags[match.teams.away.name] ?? ""}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
                        {match.tournament} &middot; {match.format}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {match.teams.home.score} / {match.teams.away.score}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#34d399" }}>
                        {match.result}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/football"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e1e2e",
              color: "#fff",
            }}
          >
            ⚽ Also check Football Scores →
          </Link>
        </div>
      </div>
    </div>
  );
}
