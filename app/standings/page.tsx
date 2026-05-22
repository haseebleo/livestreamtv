import type { Metadata } from "next";
import Link from "next/link";
import { getAllStandings, STANDING_LEAGUES, type LeagueStanding } from "@/lib/api/standings";

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export const metadata: Metadata = {
  title: "Football League Standings & Tables 2025-26",
  description:
    "Live football league standings for Premier League, La Liga, Bundesliga, Serie A and Ligue 1. Updated every match day.",
  openGraph: {
    title: "Football League Tables 2025-26",
    description: "Premier League, La Liga, Bundesliga, Serie A & Ligue 1 standings — updated every matchday.",
    images: [`${BASE}/api/og?title=Football+League+Tables+2025-26&type=football&sub=Premier+League%2C+La+Liga%2C+Bundesliga+%26+more`],
  },
};

const FORM_COLORS: Record<string, string> = { W: "#10b981", L: "#e50914", D: "#f5c518" };
const DESC_COLORS: Record<string, string> = {
  "Champions League": "#1d4ed8",
  "Europa League":    "#7c3aed",
  "Conference":       "#0891b2",
  "Relegation":       "#dc2626",
};

function descColor(desc: string): string {
  for (const [key, val] of Object.entries(DESC_COLORS)) {
    if (desc.includes(key)) return val;
  }
  return "transparent";
}

function StandingsTable({ standing }: { standing: LeagueStanding }) {
  if (standing.table.length === 0) return null;
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{standing.flag}</span>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{standing.leagueName}</h2>
        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: "auto" }}>Season {standing.season}</span>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid #1e1e2e" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#141422", borderBottom: "1px solid #1e1e2e" }}>
              {["#", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts", "Form"].map((h) => (
                <th key={h} style={{ padding: "12px 10px", textAlign: h === "Club" ? "left" : "center", color: "#9ca3af", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standing.table.map((row, i) => {
              const dc = descColor(row.description);
              const isHighlight = dc !== "transparent";
              return (
                <tr key={row.team} style={{ background: i % 2 === 0 ? "#0d0d1a" : "#0a0a14", borderBottom: "1px solid #1e1e2e" }}>
                  <td style={{ padding: "10px", textAlign: "center", position: "relative" }}>
                    {isHighlight && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: dc, borderRadius: "2px 0 0 2px" }} />}
                    <span style={{ color: "#9ca3af", fontWeight: 700 }}>{row.rank}</span>
                  </td>
                  <td style={{ padding: "10px 10px 10px 16px", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {row.badge && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={row.badge} alt={row.team} width={20} height={20} style={{ objectFit: "contain" }} />
                      )}
                      <span style={{ color: "#fff", fontWeight: 600 }}>{row.team}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px", textAlign: "center", color: "#d1d5db" }}>{row.played}</td>
                  <td style={{ padding: "10px", textAlign: "center", color: "#10b981", fontWeight: 600 }}>{row.won}</td>
                  <td style={{ padding: "10px", textAlign: "center", color: "#f5c518" }}>{row.drawn}</td>
                  <td style={{ padding: "10px", textAlign: "center", color: "#f87171" }}>{row.lost}</td>
                  <td style={{ padding: "10px", textAlign: "center", color: "#d1d5db" }}>{row.goalsFor}</td>
                  <td style={{ padding: "10px", textAlign: "center", color: "#d1d5db" }}>{row.goalsAgainst}</td>
                  <td style={{ padding: "10px", textAlign: "center", color: row.goalDiff >= 0 ? "#10b981" : "#f87171", fontWeight: 600 }}>
                    {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center", color: "#fff", fontWeight: 900, fontSize: 15 }}>{row.points}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {row.form.split("").slice(-5).map((f, fi) => (
                        <span key={fi} style={{ width: 16, height: 16, borderRadius: "50%", background: FORM_COLORS[f] ?? "#4b5563", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
        {Object.entries(DESC_COLORS).map(([label, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9ca3af" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function StandingsPage() {
  const standings = await getAllStandings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Football League Standings 2025-26",
    description: "Live football league tables for all major European leagues",
    url: `${BASE}/standings`,
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 14 }}>🏆</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            League <span className="gradient-text-amber">Standings</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>
            Live tables for {STANDING_LEAGUES.length} major European leagues — updated every match day
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {STANDING_LEAGUES.map((l) => (
              <a key={l.id} href={`#${l.id}`} style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textDecoration: "none", padding: "4px 12px", border: "1px solid #1e1e2e", borderRadius: 999 }}>
                {l.flag} {l.name.split(" ").slice(-2).join(" ")}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 1rem 5rem" }}>
        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {standings.map((s) => (
          <div key={s.leagueId} id={s.leagueId}>
            <StandingsTable standing={s} />
          </div>
        ))}

        <div className="ad-slot" style={{ height: 90, margin: "40px 0" }}>Advertisement</div>

        <div style={{ textAlign: "center" }}>
          <Link href="/football" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ⚽ Live Scores & Fixtures →
          </Link>
        </div>
      </div>
    </div>
  );
}
