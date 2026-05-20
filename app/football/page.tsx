import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllRecentMatches, getAllUpcomingMatches, getMockFootballMatches,
  LEAGUE_FLAGS, type FootballMatch,
} from "@/lib/api/football";
import { getFootballNews } from "@/lib/api/news";

export const revalidate = 300;

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

function MatchCard({ match, type }: { match: FootballMatch; type: "recent" | "upcoming" }) {
  const flag = LEAGUE_FLAGS[match.strLeague] ?? "⚽";
  const hasScore = match.intHomeScore !== null && match.intAwayScore !== null;
  const date = match.dateEvent ? new Date(match.dateEvent).toLocaleDateString("en-PK", { month: "short", day: "numeric" }) : "";
  const time = match.strTime?.slice(0, 5) ?? "";

  return (
    <div style={{ background: "#141422", border: `1px solid ${type === "recent" ? "#1e1e2e" : "rgba(96,165,250,0.15)"}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fcd34d" }}>{flag} {match.strLeague}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{date}</span>
          {type === "upcoming" && time && <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>🕐 {time}</span>}
          {type === "recent" && <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, background: "rgba(100,100,100,0.12)", border: "1px solid #2a2a2a", padding: "2px 8px", borderRadius: 999 }}>FT</span>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{match.strHomeTeam}</p>
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", borderRadius: 10, padding: "8px 16px", textAlign: "center", minWidth: 80 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
            {hasScore ? `${match.intHomeScore} – ${match.intAwayScore}` : "–"}
          </span>
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", textAlign: "right" }}>{match.strAwayTeam}</p>
      </div>
      {match.intRound && (
        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>Round {match.intRound}</p>
      )}
    </div>
  );
}

export default async function FootballPage() {
  const [recent, upcoming, news] = await Promise.all([
    getAllRecentMatches().catch(() => getMockFootballMatches()),
    getAllUpcomingMatches().catch(() => []),
    getFootballNews(),
  ]);

  const recentDisplay = (recent.length > 0 ? recent : getMockFootballMatches());
  const upcomingDisplay = upcoming;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>

      {/* Header */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16 }} aria-hidden="true">⚽</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Live <span className="gradient-text-amber">Football</span> Scores
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>
            Real-time scores from Premier League, La Liga, Champions League and 100+ competitions
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1rem 5rem" }}>

        {/* League chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {leagues.map((l, i) => (
            <span key={l.name} style={{ padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: i === 0 ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(245,158,11,0.3)" : "1px solid #1e1e2e", color: i === 0 ? "#fcd34d" : "#9ca3af" }}>
              {l.flag && `${l.flag} `}{l.name}
            </span>
          ))}
        </div>

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* ── UPCOMING FIXTURES ── */}
        {upcomingDisplay.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Upcoming football fixtures">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>📅 Upcoming Fixtures</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcomingDisplay.slice(0, 10).map((m) => <MatchCard key={m.idEvent} match={m} type="upcoming" />)}
            </div>
          </section>
        )}

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* ── RECENT RESULTS ── */}
        <section style={{ marginBottom: 48 }} aria-label="Recent football results">
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>🏁 Recent Results</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentDisplay.slice(0, 15).map((m) => <MatchCard key={m.idEvent} match={m} type="recent" />)}
          </div>
        </section>

        {/* ── NEWS ── */}
        {news.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Football news">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>📰 Football News</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {news.map((item, i) => (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16, textDecoration: "none" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 8 }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{item.source}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        <div style={{ textAlign: "center" }}>
          <Link href="/cricket" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            🏏 Check Cricket Scores →
          </Link>
        </div>
      </div>
    </div>
  );
}
