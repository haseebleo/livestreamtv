import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title    = searchParams.get("title") ?? "LiveStreamTV.pk";
  const type     = searchParams.get("type")  ?? "";
  const subtitle = searchParams.get("sub")   ?? "Pakistan's #1 Sports & Entertainment Hub";
  const rating   = searchParams.get("rating") ?? "";

  const TYPE_COLORS: Record<string, string> = {
    movie: "#e50914", show: "#0070f3", cricket: "#00b341",
    football: "#f5c518", news: "#f87171", live: "#e50914",
  };
  const accentColor = TYPE_COLORS[type] ?? "#e50914";

  const TYPE_LABELS: Record<string, string> = {
    movie: "🎬 MOVIE", show: "📺 TV SHOW", cricket: "🏏 CRICKET",
    football: "⚽ FOOTBALL", news: "📰 NEWS", live: "📡 LIVE TV",
  };
  const badge = TYPE_LABELS[type] ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          background: "linear-gradient(135deg, #0a0a0a 0%, #12040a 40%, #040a12 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "sans-serif", position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: accentColor }} />

        {/* Background glow */}
        <div style={{
          position: "absolute", top: "-20%", left: "50%", width: "60%", height: "60%",
          background: `radial-gradient(ellipse, ${accentColor}22 0%, transparent 70%)`,
          transform: "translateX(-50%)",
        }} />

        {/* Logo bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36, position: "relative" }}>
          <div style={{ background: "#e50914", color: "#fff", fontSize: 26, fontWeight: 900, padding: "8px 18px", borderRadius: 8, letterSpacing: "0.05em" }}>
            LSTV
          </div>
          <span style={{ color: "#ffffff", fontSize: 22, fontWeight: 700, opacity: 0.9 }}>LiveStreamTV.pk</span>
        </div>

        {/* Type badge */}
        {badge && (
          <div style={{
            background: `${accentColor}22`, border: `1.5px solid ${accentColor}66`,
            color: accentColor, fontSize: 14, fontWeight: 700, padding: "5px 18px",
            borderRadius: 999, marginBottom: 22, letterSpacing: "0.12em",
          }}>
            {badge}
          </div>
        )}

        {/* Title */}
        <div style={{
          color: "#ffffff", fontSize: title.length > 40 ? 44 : title.length > 25 ? 54 : 62,
          fontWeight: 900, textAlign: "center", padding: "0 80px",
          lineHeight: 1.15, marginBottom: 18, position: "relative",
        }}>
          {title}
        </div>

        {/* Rating */}
        {rating && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <span style={{ color: "#f5c518", fontSize: 22 }}>★</span>
            <span style={{ color: "#f5c518", fontSize: 22, fontWeight: 800 }}>{rating}</span>
            <span style={{ color: "#9ca3af", fontSize: 16 }}>/ 10</span>
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <div style={{ color: "#9ca3af", fontSize: 20, textAlign: "center", padding: "0 100px", lineHeight: 1.5, position: "relative" }}>
            {subtitle}
          </div>
        )}

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e50914" }} />
          <span style={{ color: "#6b7280", fontSize: 14 }}>
            livestreamtv.pk · Live Sports, Movies & TV
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e50914" }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
