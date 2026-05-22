import type { Metadata } from "next";
import Link from "next/link";
import { getAllFootballMatches, FOOTBALL_LEAGUES, type ESPNMatch } from "@/lib/api/espn";
import { getFootballNews } from "@/lib/api/news";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export const metadata: Metadata = {
  title: "Live Football Scores & Results",
  description:
    "Live football scores from Premier League, La Liga, Champions League, Bundesliga and more. Real-time updates.",
  openGraph: {
    title: "Live Football Scores & Results | LiveStreamTV.pk",
    description: "Real-time scores from Premier League, La Liga, UCL, Bundesliga, Serie A and more.",
    images: [`${BASE}/api/og?title=Live+Football+Scores&type=football&sub=PL%2C+La+Liga%2C+UCL+%26+More`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${BASE}/api/og?title=Live+Football+Scores&type=football&sub=PL%2C+La+Liga%2C+UCL+%26+More`],
  },
};

function MatchCard({ match }: { match: ESPNMatch }) {
  const isLive      = match.status === "live";
  const isUpcoming  = match.status === "upcoming";
  const isCompleted = match.status === "completed";

  const dateStr = match.date
    ? new Date(match.date).toLocaleDateString("en-PK", { weekday: "short", month: "short", day: "numeric" })
    : "";
  const timeStr = match.date
    ? new Date(match.date).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      style={{
        background: "#141422",
        border: `1px solid ${isLive ? "rgba(229,9,20,0.25)" : isUpcoming ? "rgba(96,165,250,0.15)" : "#1e1e2e"}`,
        borderRadius: 16,
        padding: 20,
        transition: "border-color 0.2s",
      }}
    >
      {/* League + status row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fcd34d" }}>
          {match.leagueFlag} {match.league}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isLive && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.35)", color: "#f87171", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
              <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
              {match.detail || "LIVE"}
            </span>
          )}
          {isCompleted && (
            <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, background: "rgba(100,100,100,0.1)", border: "1px solid #2a2a2a", padding: "3px 10px", borderRadius: 999 }}>
              {match.detail || "FT"}
            </span>
          )}
          {isUpcoming && (
            <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 600 }}>
              {dateStr} · {timeStr}
            </span>
          )}
        </div>
      </div>

      {/* Score / matchup */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <div>
          {match.homeLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.homeLogo} alt={match.homeTeam} width={28} height={28} style={{ objectFit: "contain", marginBottom: 6 }} />
          )}
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{match.homeTeam}</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", borderRadius: 12, padding: isUpcoming ? "10px 20px" : "8px 18px", textAlign: "center", minWidth: 88 }}>
          {isUpcoming ? (
            <span style={{ fontSize: 18, fontWeight: 900, color: "#6b7280" }}>–</span>
          ) : (
            <span style={{ fontSize: 26, fontWeight: 900, color: isLive ? "#fff" : "#d1d5db" }}>
              {match.homeScore ?? 0} – {match.awayScore ?? 0}
            </span>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          {match.awayLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.awayLogo} alt={match.awayTeam} width={28} height={28} style={{ objectFit: "contain", marginBottom: 6, marginLeft: "auto", display: "block" }} />
          )}
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{match.awayTeam}</p>
        </div>
      </div>

      {match.venue && (
        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 12, paddingTop: 10, borderTop: "1px solid #1e1e2e" }}>
          📍 {match.venue}
        </p>
      )}
    </div>
  );
}

export default async function FootballPage() {
  const [allMatches, news] = await Promise.all([
    getAllFootballMatches(),
    getFootballNews(),
  ]);

  const live      = allMatches.filter((m) => m.status === "live");
  const upcoming  = allMatches.filter((m) => m.status === "upcoming");
  const completed = allMatches.filter((m) => m.status === "completed");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "Live Football Scores",
    description: "Real-time football scores from major European leagues and international competitions",
    url: `${BASE}/football`,
    sport: "Football",
    location: { "@type": "VirtualLocation", url: `${BASE}/football` },
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16 }} aria-hidden="true">⚽</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Live <span className="gradient-text-amber">Football</span> Scores
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 520, margin: "0 auto 20px" }}>
            Real-time scores from {FOOTBALL_LEAGUES.length} leagues — Premier League, La Liga, UCL and more
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 13, fontWeight: 700 }}>
            {live.length > 0      && <span style={{ color: "#f87171" }}>● {live.length} Live</span>}
            {upcoming.length > 0  && <span style={{ color: "#60a5fa" }}>● {upcoming.length} Upcoming</span>}
            {completed.length > 0 && <span style={{ color: "#9ca3af" }}>● {completed.length} Results</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem 5rem" }}>

        {/* League filter chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {FOOTBALL_LEAGUES.map((l, i) => (
            <span key={l.slug} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: i === 0 ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(245,158,11,0.3)" : "1px solid #1e1e2e", color: i === 0 ? "#fcd34d" : "#9ca3af" }}>
              {l.flag} {l.name}
            </span>
          ))}
        </div>

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* ── LIVE ── */}
        {live.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Live football matches">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span className="live-dot" style={{ width: 10, height: 10, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>Live Now</h2>
              <span style={{ background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>
                {live.length} LIVE
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {live.map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        {/* ── UPCOMING ── */}
        {upcoming.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Upcoming fixtures">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>📅 Upcoming Fixtures</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {upcoming.slice(0, 20).map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        <div className="ad-slot" style={{ height: 90, marginBottom: 48 }}>Advertisement</div>

        {/* ── RECENT RESULTS ── */}
        {completed.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Recent results">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>🏁 Recent Results</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {completed.slice(0, 24).map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        {/* ── NEWS ── */}
        {news.length > 0 && (
          <section style={{ marginBottom: 48 }} aria-label="Football news">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 24 }}>📰 Football News</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {news.map((item, i) => (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16, textDecoration: "none" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 8 }}>{item.title}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#6b7280" }}>{item.source}</span>
                    <span style={{ fontSize: 10, color: "#60a5fa" }}>→</span>
                  </div>
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
