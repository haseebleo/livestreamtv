"use client";

import { useState } from "react";

interface Channel {
  name: string;
  country: string;
  category: string;
  ytId: string | null;
  type: "live" | "channel" | "link";
}

const channels: Channel[] = [
  // ── Cricket
  { name: "ICC TV", country: "🌍", category: "Cricket", ytId: "UCiWrjBhlICf_L_RK5y6Vrxw", type: "channel" },
  { name: "PTV Sports", country: "🇵🇰", category: "Cricket", ytId: "EfWvGaJCgYQ", type: "live" },
  { name: "Sky Sports Cricket", country: "🇬🇧", category: "Cricket", ytId: null, type: "link" },
  { name: "Willow Cricket", country: "🇺🇸", category: "Cricket", ytId: null, type: "link" },
  { name: "Star Sports 1", country: "🇮🇳", category: "Cricket", ytId: null, type: "link" },
  // ── Sports
  { name: "Sky Sports News", country: "🇬🇧", category: "Sports", ytId: "qEJbRPgBBcE", type: "live" },
  { name: "ESPN FC", country: "🇺🇸", category: "Sports", ytId: null, type: "link" },
  { name: "beIN Sports", country: "🇶🇦", category: "Sports", ytId: null, type: "link" },
  { name: "Ten Sports", country: "🇵🇰", category: "Sports", ytId: null, type: "link" },
  // ── Pakistani News
  { name: "Geo News", country: "🇵🇰", category: "News", ytId: "N8SEBU2PZ-A", type: "live" },
  { name: "ARY News Live", country: "🇵🇰", category: "News", ytId: "3IYTP1OdPD8", type: "live" },
  { name: "Samaa TV", country: "🇵🇰", category: "News", ytId: "RFJxBmUNZIc", type: "live" },
  { name: "Bol News", country: "🇵🇰", category: "News", ytId: "S8yMfwzM3eY", type: "live" },
  { name: "Express News", country: "🇵🇰", category: "News", ytId: "qSSERiU4-PQ", type: "live" },
  // ── International News
  { name: "Al Jazeera English", country: "🇶🇦", category: "International", ytId: "F422C9SfNI8", type: "live" },
  { name: "DW News", country: "🇩🇪", category: "International", ytId: "F_ZpbBt3o0o", type: "live" },
  { name: "France 24 English", country: "🇫🇷", category: "International", ytId: "1KSuvPsRRRI", type: "live" },
  { name: "CNN International", country: "🇺🇸", category: "International", ytId: "HW9ygT6oIJo", type: "live" },
  { name: "Sky News", country: "🇬🇧", category: "International", ytId: "9Auq9mYxFEE", type: "live" },
  { name: "BBC News", country: "🇬🇧", category: "International", ytId: "w_Ma8oQLmSM", type: "live" },
  // ── Entertainment
  { name: "Hum TV", country: "🇵🇰", category: "Entertainment", ytId: "5hH2LrEBWN8", type: "live" },
  { name: "ARY Digital", country: "🇵🇰", category: "Entertainment", ytId: "7eDQb0V3HXY", type: "live" },
  { name: "Geo Entertainment", country: "🇵🇰", category: "Entertainment", ytId: null, type: "link" },
];

const categories = ["All", "Cricket", "Sports", "News", "International", "Entertainment"];

const categoryStyles: Record<string, { color: string; bg: string; border: string }> = {
  Cricket: { color: "#34d399", bg: "rgba(0,179,65,0.1)", border: "rgba(0,179,65,0.2)" },
  Sports: { color: "#60a5fa", bg: "rgba(0,112,243,0.1)", border: "rgba(0,112,243,0.2)" },
  News: { color: "#f87171", bg: "rgba(229,9,20,0.1)", border: "rgba(229,9,20,0.2)" },
  International: { color: "#fcd34d", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  Entertainment: { color: "#f472b6", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)" },
};

function getEmbedUrl(channel: Channel): string | null {
  if (!channel.ytId) return null;
  if (channel.type === "channel") {
    return `https://www.youtube.com/embed/live_stream?channel=${channel.ytId}&autoplay=1&rel=0`;
  }
  return `https://www.youtube.com/embed/${channel.ytId}?autoplay=1&rel=0`;
}

export default function LiveTvPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const filtered =
    activeCategory === "All"
      ? channels
      : channels.filter((c) => c.category === activeCategory);

  const embedUrl = selectedChannel ? getEmbedUrl(selectedChannel) : null;
  const style = selectedChannel ? (categoryStyles[selectedChannel.category] ?? categoryStyles.News) : null;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64, background: "#0a0a0a" }}>

      {/* ── HEADER ── */}
      <div
        style={{
          position: "relative",
          padding: "2.5rem 1rem 1.5rem",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(229,9,20,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 40 }} aria-hidden="true">📡</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 999, padding: "4px 12px" }}>
              <span className="live-dot" style={{ width: 8, height: 8, background: "#e50914", borderRadius: "50%", display: "inline-block" }} aria-hidden="true" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em" }}>LIVE</span>
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#ffffff", marginBottom: 8 }}>
            Free <span className="gradient-text">Live TV</span> Channels
          </h1>
          <p style={{ color: "#b3b3b3", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>
            Watch live sports, news and entertainment channels online — free
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "1.5rem 1rem 4rem",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 24,
        }}
      >
        {/* ── LEFT SIDEBAR ── */}
        <aside>
          {/* Category filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  background: activeCategory === c ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.04)",
                  border: activeCategory === c ? "1px solid rgba(229,9,20,0.3)" : "1px solid #2a2a2a",
                  color: activeCategory === c ? "#f87171" : "#b3b3b3",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Channel list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filtered.map((ch) => {
              const cs = categoryStyles[ch.category] ?? categoryStyles.News;
              const isSelected = selectedChannel?.name === ch.name;
              return (
                <button
                  key={ch.name}
                  onClick={() => {
                    if (ch.type === "link") {
                      window.open("https://www.eurosport.com/live", "_blank");
                    } else {
                      setSelectedChannel(ch);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: isSelected ? "rgba(229,9,20,0.1)" : "#1c1c1c",
                    border: isSelected ? "1px solid rgba(229,9,20,0.3)" : "1px solid #2a2a2a",
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "linear-gradient(135deg, rgba(229,9,20,0.2), rgba(0,0,0,0.4))",
                      border: "1px solid #2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    📺
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: isSelected ? "#f87171" : "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ch.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: 3,
                          background: cs.bg,
                          border: `1px solid ${cs.border}`,
                          color: cs.color,
                        }}
                      >
                        {ch.category}
                      </span>
                      <span style={{ fontSize: 12 }} aria-label={`Country: ${ch.country}`}>{ch.country}</span>
                    </div>
                  </div>
                  {ch.type !== "link" && ch.ytId && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        background: "rgba(229,9,20,0.12)",
                        border: "1px solid rgba(229,9,20,0.25)",
                        borderRadius: 3,
                        padding: "1px 5px",
                        flexShrink: 0,
                      }}
                    >
                      <span className="live-dot" style={{ width: 5, height: 5, background: "#e50914", borderRadius: "50%", display: "inline-block" }} aria-hidden="true" />
                      <span style={{ fontSize: 8, fontWeight: 700, color: "#f87171" }}>LIVE</span>
                    </div>
                  )}
                  {ch.type === "link" && (
                    <span style={{ fontSize: 10, color: "#6b7280" }}>↗</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── RIGHT: PLAYER ── */}
        <div style={{ minWidth: 0 }}>
          {selectedChannel && embedUrl ? (
            <>
              {/* Player */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "#000",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #2a2a2a",
                  marginBottom: 16,
                }}
              >
                <iframe
                  src={embedUrl}
                  title={selectedChannel.name}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Channel info */}
              <div
                style={{
                  background: "#1c1c1c",
                  border: "1px solid #2a2a2a",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, rgba(229,9,20,0.25), rgba(0,0,0,0.5))",
                      border: "1px solid #2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                    aria-hidden="true"
                  >
                    📺
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>{selectedChannel.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      {style && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 3, background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
                          {selectedChannel.category}
                        </span>
                      )}
                      <span style={{ fontSize: 14 }} aria-label={`Country: ${selectedChannel.country}`}>{selectedChannel.country}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 6, padding: "6px 14px" }}>
                  <span className="live-dot" style={{ width: 8, height: 8, background: "#e50914", borderRadius: "50%", display: "inline-block" }} aria-hidden="true" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>LIVE NOW</span>
                </div>
              </div>

              {/* Ad slot */}
              <div className="ad-slot" style={{ height: 90, marginBottom: 24 }}>Advertisement</div>
            </>
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "16/9",
                background: "#141414",
                border: "2px dashed #2a2a2a",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 56 }} aria-hidden="true">📡</span>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>Select a Channel</p>
              <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", maxWidth: 300 }}>
                Choose a channel from the sidebar to start watching live
              </p>
            </div>
          )}

          {/* More channels coming soon */}
          <div
            style={{
              background: "#1c1c1c",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              padding: 20,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>
              🚀 More Channels Coming Soon
            </p>
            <p style={{ fontSize: 13, color: "#b3b3b3", lineHeight: 1.6 }}>
              We&apos;re adding more live sports and entertainment channels every week.
              Cricket, Football, Tennis, Boxing and much more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
