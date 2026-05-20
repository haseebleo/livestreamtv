import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentMatches, getMatchStatus, formatScore, type CricMatch } from "@/lib/api/cricket";
import { getCricketNews } from "@/lib/api/news";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Live Cricket Scores & Schedules",
  description:
    "Live cricket scores, ball-by-ball commentary, and match schedules for Asia Cup, ICC World Cup, Test Series and T20 leagues worldwide.",
};

const FORMAT_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  odi:  { color: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  t20:  { color: "#a78bfa", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)" },
  test: { color: "#fcd34d", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
};

function MatchCard({ match }: { match: CricMatch }) {
  const status = getMatchStatus(match);
  const t1 = match.teams[0] ?? "Team A";
  const t2 = match.teams[1] ?? "Team B";
  const s1 = formatScore(match, t1);
  const s2 = formatScore(match, t2);
  const fmt = FORMAT_COLORS[match.matchType?.toLowerCase()] ?? FORMAT_COLORS.odi;
  const fmtLabel = match.matchType?.toUpperCase() ?? "MATCH";

  return (
    <div
      style={{
        background: "#141422",
        border: `1px solid ${status === "live" ? "rgba(16,185,129,0.2)" : status === "upcoming" ? "rgba(96,165,250,0.15)" : "#1e1e2e"}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 20 }}>
        {status === "live" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
            <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
            LIVE
          </div>
        )}
        {status === "upcoming" && (
          <div style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)", color: "#60a5fa", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
            UPCOMING
          </div>
        )}
        {status === "completed" && (
          <div style={{ background: "rgba(100,100,100,0.12)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
            COMPLETED
          </div>
        )}
        <span style={{ background: fmt.bg, border: `1px solid ${fmt.border}`, color: fmt.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
          {fmtLabel}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{match.name}</span>
      </div>

      {/* Score grid */}
      {status !== "upcoming" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{t1}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#10b981", lineHeight: 1 }}>{s1}</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#6b7280" }}>VS</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{t2}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#d1d5db", lineHeight: 1 }}>{s2}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{t1}</p>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#6b7280" }}>VS</span>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{t2}</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #1e1e2e", fontSize: 11, color: "#9ca3af" }}>
        {match.venue ? <span>📍 {match.venue}</span> : <span />}
        {status === "completed" && match.status && (
          <span style={{ color: "#34d399", fontWeight: 600 }}>✓ {match.status}</span>
        )}
        {status === "upcoming" && match.date && (
          <span style={{ color: "#60a5fa" }}>🕐 {new Date(match.date).toLocaleDateString("en-PK", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        )}
      </div>
    </div>
  );
}

export default async function CricketPage() {
  const [matches, news] = await Promise.all([
    getCurrentMatches(),
    getCricketNews(),
  ]);

  const live = matches.filter((m) => getMatchStatus(m) === "live");
  const upcoming = matches.filter((m) => getMatchStatus(m) === "upcoming");
  const completed = matches.filter((m) => getMatchStatus(m) === "completed");

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      {/* Header */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16 }} aria-hidden="true">🏏</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Live <span className="gradient-text-green">Cricket</span> Scores
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 480, margin: "0 auto" }}>
            Ball-by-ball updates from every major cricket match worldwide
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, fontSize: 13, fontWeight: 700 }}>
            {live.length > 0 && <span style={{ color: "#f87171" }}>● {live.length} Live</span>}
            {upcoming.length > 0 && <span style={{ color: "#60a5fa" }}>● {upcoming.length} Upcoming</span>}
            {completed.length > 0 && <span style={{ color: "#9ca3af" }}>● {completed.length} Results</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1rem 5rem" }}>

        <div className="ad-slot" style={{ height: 90, marginBottom: 32 }}>Advertisement</div>

        {/* ── LIVE ── */}
        {live.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Live cricket matches">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span className="live-dot" style={{ width: 10, height: 10, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>Live Matches</h2>
              <span style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>{live.length} LIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {live.map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        {/* ── UPCOMING ── */}
        {upcoming.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Upcoming cricket matches">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>🕐 Upcoming Matches</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        <div className="ad-slot" style={{ height: 90, marginBottom: 48 }}>Advertisement</div>

        {/* ── RECENT RESULTS ── */}
        {completed.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Recent cricket results">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>Recent Results</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {completed.map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        {/* ── NEWS ── */}
        {news.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Cricket news">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>📰 Cricket News</h2>
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

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/football" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ⚽ Check Football Scores →
          </Link>
        </div>
      </div>
    </div>
  );
}
