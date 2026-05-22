import type { Metadata } from "next";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export const metadata: Metadata = {
  title: "Cricket & Football Highlights",
  description:
    "Watch the latest cricket and football video highlights. Best moments from ICC, PSL, Premier League, Champions League and more.",
  openGraph: {
    title: "Cricket & Football Highlights | LiveStreamTV.pk",
    description: "Watch the latest match highlights — cricket and football from official channels.",
    images: [`${BASE}/api/og?title=Cricket+%26+Football+Highlights&type=live&sub=ICC%2C+PSL%2C+Premier+League+%26+more`],
  },
};

interface HighlightVideo {
  id: string;
  title: string;
  channel: string;
  category: "Cricket" | "Football" | "PSL" | "UCL";
  ytId: string;
}

// Official channel highlight videos — update these via admin as new highlights drop
const HIGHLIGHTS: HighlightVideo[] = [
  // Cricket
  { id: "1", title: "ICC Cricket Best Moments 2026", channel: "ICC", category: "Cricket", ytId: "UCiWrjBhlICf_L_RK5y6Vrxw" },
  { id: "2", title: "PCB Official Highlights 2026", channel: "PCB", category: "Cricket", ytId: "UCnBsO0I_4KKJD-GYJmBi5xA" },
  // PSL
  { id: "3", title: "PSL 2026 Highlights", channel: "PCB", category: "PSL", ytId: "UCnBsO0I_4KKJD-GYJmBi5xA" },
  // Football
  { id: "4", title: "Premier League Top Goals 2025-26", channel: "Premier League", category: "Football", ytId: "UCqZQlzSHbVJrwrn5XvzrzcA" },
  { id: "5", title: "Champions League Highlights", channel: "UEFA", category: "UCL", ytId: "UCPo4npEg0TsaEAqiFXwi6JQ" },
  { id: "6", title: "La Liga Weekly Highlights", channel: "La Liga", category: "Football", ytId: "UCgIMsHK07SjfPzDGzJizpGQ" },
];

const CAT_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Cricket:  { color: "#34d399", bg: "rgba(0,179,65,0.1)",   border: "rgba(0,179,65,0.25)"  },
  PSL:      { color: "#a78bfa", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.25)"},
  Football: { color: "#60a5fa", bg: "rgba(0,112,243,0.1)",  border: "rgba(0,112,243,0.25)" },
  UCL:      { color: "#fcd34d", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)"},
};

const FEATURED_CHANNELS = [
  { name: "ICC",             ytId: "UCiWrjBhlICf_L_RK5y6Vrxw", emoji: "🏏", desc: "Official ICC cricket highlights" },
  { name: "PCB",             ytId: "UCnBsO0I_4KKJD-GYJmBi5xA", emoji: "🇵🇰", desc: "Pakistan Cricket Board" },
  { name: "Premier League",  ytId: "UCqZQlzSHbVJrwrn5XvzrzcA", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", desc: "Official Premier League channel" },
  { name: "UEFA Champions",  ytId: "UCPo4npEg0TsaEAqiFXwi6JQ", emoji: "🏆", desc: "UEFA Champions League" },
  { name: "La Liga",         ytId: "UCgIMsHK07SjfPzDGzJizpGQ", emoji: "🇪🇸", desc: "Official La Liga highlights" },
  { name: "Sky Sports",      ytId: "UCNAf1k0yIjyGu3k9BwAg3lg", emoji: "🎙️", desc: "Sky Sports highlights & analysis" },
];

export default function HighlightsPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>

      {/* Header */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(229,9,20,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 14 }}>🎬</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Match <span className="gradient-text">Highlights</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>
            Latest cricket and football highlights from official channels
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem 5rem" }}>
        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* ── FEATURED OFFICIAL CHANNELS ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 24 }}>
            📺 Official Highlight Channels
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {FEATURED_CHANNELS.map((ch) => (
              <a
                key={ch.name}
                href={`https://www.youtube.com/channel/${ch.ytId}?sub_confirmation=1`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 20, textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 30 }}>{ch.emoji}</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{ch.name}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af" }}>{ch.desc}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f87171" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>Watch on YouTube →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── EMBEDDED HIGHLIGHTS ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 24 }}>
            🏏 Cricket Highlights
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {HIGHLIGHTS.filter((h) => ["Cricket", "PSL"].includes(h.category)).map((h) => {
              const style = CAT_STYLES[h.category];
              return (
                <div key={h.id} style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/live_stream?channel=${h.ytId}&rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      title={h.title}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
                        {h.category}
                      </span>
                      <span style={{ fontSize: 11, color: "#6b7280" }}>{h.channel}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{h.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 24 }}>
            ⚽ Football Highlights
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {HIGHLIGHTS.filter((h) => ["Football", "UCL"].includes(h.category)).map((h) => {
              const style = CAT_STYLES[h.category];
              return (
                <div key={h.id} style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/live_stream?channel=${h.ytId}&rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      title={h.title}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
                        {h.category}
                      </span>
                      <span style={{ fontSize: 11, color: "#6b7280" }}>{h.channel}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{h.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/cricket" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(0,179,65,0.1)", border: "1px solid rgba(0,179,65,0.2)", color: "#34d399", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            🏏 Live Cricket Scores
          </Link>
          <Link href="/football" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(0,112,243,0.1)", border: "1px solid rgba(0,112,243,0.2)", color: "#60a5fa", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ⚽ Live Football Scores
          </Link>
        </div>
      </div>
    </div>
  );
}
