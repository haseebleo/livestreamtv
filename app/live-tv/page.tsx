"use client";

import { useState } from "react";

interface Channel {
  name: string;
  country: string;
  category: string;
  ytId: string | null;
  type: "channel" | "live" | "link";
  website?: string;
}

// "channel" type = YouTube channel ID (live_stream?channel=...) — stable, always points to current live broadcast
// "live"    type = specific YouTube video ID — direct embed
// "link"    type = no stream, show external website button

const channels: Channel[] = [
  // ── 🏏 CRICKET ──
  { name: "ICC TV",           country: "🌍", category: "Cricket",       ytId: "UCiWrjBhlICf_L_RK5y6Vrxw", type: "channel" },
  { name: "PTV Sports",       country: "🇵🇰", category: "Cricket",       ytId: "EfWvGaJCgYQ",              type: "live",    website: "https://ptvsports.pk" },
  { name: "PCB Official",     country: "🇵🇰", category: "Cricket",       ytId: "UCnBsO0I_4KKJD-GYJmBi5xA", type: "channel", website: "https://pcb.com.pk" },
  { name: "Sky Sports Cricket",country:"🇬🇧", category: "Cricket",       ytId: null,                       type: "link",    website: "https://www.skysports.com/watch" },
  { name: "Willow Cricket",   country: "🇺🇸", category: "Cricket",       ytId: null,                       type: "link",    website: "https://www.willowcricket.com" },
  { name: "Star Sports 1",    country: "🇮🇳", category: "Cricket",       ytId: null,                       type: "link",    website: "https://www.hotstar.com" },
  { name: "Sony LIV Sports",  country: "🇮🇳", category: "Cricket",       ytId: null,                       type: "link",    website: "https://www.sonyliv.com" },

  // ── ⚽ SPORTS ──
  { name: "Sky Sports News",  country: "🇬🇧", category: "Sports",        ytId: "qEJbRPgBBcE",              type: "live",    website: "https://www.skysports.com" },
  { name: "beIN Sports",      country: "🇶🇦", category: "Sports",        ytId: null,                       type: "link",    website: "https://www.beinsports.com" },
  { name: "ESPN",             country: "🇺🇸", category: "Sports",        ytId: "UCiWrjBhlICf_L_RK5y6Vrxw", type: "link",   website: "https://www.espn.com/watch" },
  { name: "Ten Sports",       country: "🇵🇰", category: "Sports",        ytId: null,                       type: "link",    website: "https://www.tensports.com" },
  { name: "SuperSport",       country: "🇿🇦", category: "Sports",        ytId: null,                       type: "link",    website: "https://www.supersport.com" },
  { name: "Eurosport",        country: "🇪🇺", category: "Sports",        ytId: null,                       type: "link",    website: "https://www.eurosport.com" },

  // ── 🇵🇰 PAKISTAN NEWS ──
  { name: "Geo News",         country: "🇵🇰", category: "Pakistan",      ytId: "N8SEBU2PZ-A",              type: "live",    website: "https://www.geo.tv/live" },
  { name: "ARY News",         country: "🇵🇰", category: "Pakistan",      ytId: "3IYTP1OdPD8",              type: "live",    website: "https://arynews.tv/live" },
  { name: "Samaa TV",         country: "🇵🇰", category: "Pakistan",      ytId: "RFJxBmUNZIc",              type: "live",    website: "https://www.samaa.tv/live" },
  { name: "Bol News",         country: "🇵🇰", category: "Pakistan",      ytId: "S8yMfwzM3eY",              type: "live",    website: "https://www.bolnews.com/live" },
  { name: "Express News",     country: "🇵🇰", category: "Pakistan",      ytId: "qSSERiU4-PQ",              type: "live",    website: "https://www.express.pk/live" },
  { name: "Dunya News",       country: "🇵🇰", category: "Pakistan",      ytId: "UCr0rLbQxqsJyWmIhvLdqU1A", type: "channel", website: "https://dunyanews.tv/live" },
  { name: "92 News",          country: "🇵🇰", category: "Pakistan",      ytId: "UCKKvGvLlm0P7boBnI0x2eKg", type: "channel", website: "https://www.92newshd.tv/live" },
  { name: "Hum News",         country: "🇵🇰", category: "Pakistan",      ytId: "UCNDin94hBWgfBGxSXegxSmw", type: "channel", website: "https://humnews.pk/live" },
  { name: "Dawn News",        country: "🇵🇰", category: "Pakistan",      ytId: "UCdNtBIGKE-K0m3J7v_cFMcw", type: "channel", website: "https://www.dawn.com/videos" },
  { name: "A Plus",           country: "🇵🇰", category: "Pakistan",      ytId: "UCEAUICyFGRdIFUFGSFJJfbA", type: "channel", website: "https://aplusent.com" },

  // ── 🌍 INTERNATIONAL NEWS ──
  { name: "Al Jazeera",       country: "🇶🇦", category: "International", ytId: "UCNye-wNBqNL5ZzHSJdHvTpg", type: "channel", website: "https://www.aljazeera.com/live" },
  { name: "DW News",          country: "🇩🇪", category: "International", ytId: "UCknLrEdhRCp1aegoMqRaCZg", type: "channel", website: "https://www.dw.com/en/live-tv" },
  { name: "France 24",        country: "🇫🇷", category: "International", ytId: "UCQfwfsi5VrQ8yKZ-UWmAqaw", type: "channel", website: "https://www.france24.com/en/live" },
  { name: "BBC News",         country: "🇬🇧", category: "International", ytId: "UC16niRr0X2B-ovMETtMiDzg", type: "channel", website: "https://www.bbc.com/news/live" },
  { name: "CNN International",country: "🇺🇸", category: "International", ytId: "UCupvZG-5ko_eiXAupbDfxWw", type: "channel", website: "https://edition.cnn.com/live-tv" },
  { name: "Sky News",         country: "🇬🇧", category: "International", ytId: "UCoMdktPbSTixAyNGwb-UYkQ", type: "channel", website: "https://news.sky.com/watch-live" },
  { name: "RT News",          country: "🇷🇺", category: "International", ytId: "UCpwvZwUam-URkxB7g4USKpg", type: "channel", website: "https://www.rt.com/on-air" },
  { name: "Euronews",         country: "🇪🇺", category: "International", ytId: "UCg4QNMZan43qDiRoK08CEMA", type: "channel", website: "https://www.euronews.com/live" },
  { name: "TRT World",        country: "🇹🇷", category: "International", ytId: "UC7fWeaHhqgM4Ry-RMpM2YYw", type: "channel", website: "https://www.trtworld.com/live" },
  { name: "NHK World Japan",  country: "🇯🇵", category: "International", ytId: "UCfB-yzl7KeOGADFLFbHFWGg", type: "channel", website: "https://www3.nhk.or.jp/nhkworld/en/live" },
  { name: "WION",             country: "🇮🇳", category: "International", ytId: "UCjOHNS-SFuBHmIAF38-JxQg", type: "channel", website: "https://www.wionews.com/live-tv" },
  { name: "CGTN",             country: "🇨🇳", category: "International", ytId: "UCqpB6nT6MxTMrOIBTmGkqEQ", type: "channel", website: "https://www.cgtn.com/live" },
  { name: "India Today",      country: "🇮🇳", category: "International", ytId: "UCYPvAwZP8pZhSMW8qs7cVCw", type: "channel", website: "https://www.indiatoday.in/livetv" },
  { name: "Republic TV",      country: "🇮🇳", category: "International", ytId: "UCEAFtRx3WNNy2vhzJBk2hSQ", type: "channel", website: "https://www.republicworld.com/livetv" },

  // ── 📺 ENTERTAINMENT ──
  { name: "Hum TV",           country: "🇵🇰", category: "Entertainment", ytId: "5hH2LrEBWN8",              type: "live",    website: "https://www.humtv.com.pk/live" },
  { name: "ARY Digital",      country: "🇵🇰", category: "Entertainment", ytId: "7eDQb0V3HXY",              type: "live",    website: "https://arytv.com/live" },
  { name: "Geo Entertainment",country: "🇵🇰", category: "Entertainment", ytId: "UCFfRUFHmolXVBMHiJwCKJYg", type: "channel", website: "https://www.geo.tv/geoentertainment/live" },
  { name: "Urdu 1",           country: "🇵🇰", category: "Entertainment", ytId: "UCdSNkSzZMM6WlMcBjhIIzFg", type: "channel", website: "https://urdu1.tv" },
  { name: "TV One",           country: "🇵🇰", category: "Entertainment", ytId: "UC-lzCbUb4i30EGMRzWz4sPQ", type: "channel", website: "https://tvone.tv/live" },
  { name: "Zee TV",           country: "🇮🇳", category: "Entertainment", ytId: null,                       type: "link",    website: "https://zee5.com" },
  { name: "Colors TV",        country: "🇮🇳", category: "Entertainment", ytId: null,                       type: "link",    website: "https://www.colorstv.com/live-tv" },
];

const CATEGORIES = ["All", "Cricket", "Sports", "Pakistan", "International", "Entertainment"];

const CAT_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Cricket:       { color: "#34d399", bg: "rgba(0,179,65,0.12)",   border: "rgba(0,179,65,0.25)"  },
  Sports:        { color: "#60a5fa", bg: "rgba(0,112,243,0.12)",  border: "rgba(0,112,243,0.25)" },
  Pakistan:      { color: "#f87171", bg: "rgba(229,9,20,0.12)",   border: "rgba(229,9,20,0.25)"  },
  International: { color: "#fcd34d", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)"},
  Entertainment: { color: "#f472b6", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.25)"},
};

function getEmbedUrl(ch: Channel): string | null {
  if (!ch.ytId) return null;
  if (ch.type === "channel") {
    return `https://www.youtube.com/embed/live_stream?channel=${ch.ytId}&autoplay=1&rel=0&modestbranding=1`;
  }
  return `https://www.youtube.com/embed/${ch.ytId}?autoplay=1&rel=0&modestbranding=1`;
}

export default function LiveTvPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<Channel | null>(null);

  const filtered = activeCategory === "All" ? channels : channels.filter((c) => c.category === activeCategory);
  const embedUrl = selected ? getEmbedUrl(selected) : null;
  const catStyle = selected ? (CAT_STYLES[selected.category] ?? CAT_STYLES.Pakistan) : null;
  const hasStream = selected && selected.ytId !== null;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64, background: "#0a0a0a" }}>

      {/* ── HEADER ── */}
      <div style={{ position: "relative", padding: "2.5rem 1rem 1.5rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(229,9,20,0.1) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 40 }} aria-hidden="true">📡</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 999, padding: "4px 12px" }}>
              <span className="live-dot" style={{ width: 8, height: 8, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em" }}>LIVE TV</span>
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#fff", marginBottom: 10 }}>
            Live TV Channels
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 480, margin: "0 auto" }}>
            {channels.length} channels from Cricket, Sports, News &amp; Entertainment worldwide
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem 5rem" }}>

        {/* Category filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28, justifyContent: "center" }}>
          {CATEGORIES.map((cat) => {
            const style = CAT_STYLES[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                  border: isActive ? `1px solid ${style?.border ?? "rgba(229,9,20,0.3)"}` : "1px solid #1e1e2e",
                  background: isActive ? (style?.bg ?? "rgba(229,9,20,0.12)") : "rgba(255,255,255,0.03)",
                  color: isActive ? (style?.color ?? "#f87171") : "#9ca3af",
                  cursor: "pointer",
                }}
              >
                {cat} {cat !== "All" && <span style={{ opacity: 0.6 }}>({channels.filter((c) => c.category === cat).length})</span>}
              </button>
            );
          })}
        </div>

        {/* ── PLAYER ── */}
        {selected && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{selected.country}</span>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{selected.name}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    background: catStyle?.bg, border: `1px solid ${catStyle?.border}`, color: catStyle?.color,
                  }}>
                    {selected.category}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {selected.website && (
                  <a href={selected.website} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", textDecoration: "none", padding: "6px 14px", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 8, background: "rgba(96,165,250,0.08)" }}>
                    Official Site ↗
                  </a>
                )}
                <button
                  onClick={() => setSelected(null)}
                  style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", background: "rgba(255,255,255,0.05)", border: "1px solid #2a2a2a", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {hasStream && embedUrl ? (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000", borderRadius: 12, overflow: "hidden", border: "1px solid #1e1e2e" }}>
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  title={selected.name}
                />
              </div>
            ) : (
              <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: "48px 32px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📺</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{selected.name} — Official Stream</p>
                <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>
                  This channel broadcasts via its official website (subscription may be required).
                </p>
                {selected.website && (
                  <a href={selected.website} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "#e50914", color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
                    Watch on Official Site ↗
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CHANNEL GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {filtered.map((ch) => {
            const style = CAT_STYLES[ch.category] ?? CAT_STYLES.Pakistan;
            const isActive = selected?.name === ch.name;
            const canStream = ch.ytId !== null;
            return (
              <button
                key={ch.name}
                onClick={() => setSelected(ch)}
                style={{
                  background: isActive ? "rgba(229,9,20,0.1)" : "#141422",
                  border: isActive ? "1px solid rgba(229,9,20,0.4)" : "1px solid #1e1e2e",
                  borderRadius: 12,
                  padding: "16px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{ch.country}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>
                      {ch.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
                        {ch.category}
                      </span>
                      {canStream ? (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", gap: 3 }}>
                          <span className="live-dot" style={{ width: 5, height: 5, background: "#34d399", borderRadius: "50%", display: "inline-block" }} /> LIVE
                        </span>
                      ) : (
                        <span style={{ fontSize: 9, color: "#6b7280", fontWeight: 600 }}>EXT</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 32, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, background: "#34d399", borderRadius: "50%", display: "inline-block" }} />
            LIVE = streams directly here
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>EXT = links to official website</span>
        </div>

        <div className="ad-slot" style={{ height: 90, marginTop: 40 }}>Advertisement</div>
      </div>
    </div>
  );
}
