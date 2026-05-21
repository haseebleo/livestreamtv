import type { Metadata } from "next";
import { getLatestNews, type NewsItem } from "@/lib/api/news";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Sports & Entertainment News",
  description:
    "Latest cricket, football and sports news from BBC Sport, ESPN Cricinfo, Dawn Sports, Sky Sports and more.",
};

const CAT_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Cricket:     { color: "#34d399", bg: "rgba(0,179,65,0.1)",    border: "rgba(0,179,65,0.25)"   },
  Football:    { color: "#60a5fa", bg: "rgba(0,112,243,0.1)",   border: "rgba(0,112,243,0.25)"  },
  Pakistan:    { color: "#f87171", bg: "rgba(229,9,20,0.1)",    border: "rgba(229,9,20,0.25)"   },
};

function NewsCard({ item }: { item: NewsItem }) {
  const style = CAT_STYLES[item.category] ?? CAT_STYLES.Cricket;
  const date = item.pubDate
    ? new Date(item.pubDate).toLocaleDateString("en-PK", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "#141422",
        border: "1px solid #1e1e2e",
        borderRadius: 14,
        padding: 20,
        textDecoration: "none",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
          {item.category}
        </span>
        <span style={{ fontSize: 11, color: "#6b7280" }}>{item.source}</span>
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 10 }}>
        {item.title}
      </p>
      {item.description && (
        <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.55, marginBottom: 12,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
          {item.description}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {date && <span style={{ fontSize: 11, color: "#6b7280" }}>🕐 {date}</span>}
        <span style={{ fontSize: 12, fontWeight: 700, color: style.color }}>Read more →</span>
      </div>
    </a>
  );
}

export default async function NewsPage() {
  const news = await getLatestNews();

  const cricket  = news.filter((n) => n.category === "Cricket");
  const football = news.filter((n) => n.category === "Football");
  const pakistan = news.filter((n) => n.category === "Pakistan");
  const other    = news.filter((n) => !["Cricket", "Football", "Pakistan"].includes(n.category));

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>

      {/* Header */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(229,9,20,0.1) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16 }} aria-hidden="true">📰</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Latest <span className="gradient-text">Sports News</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>
            Live headlines from BBC Sport, ESPN Cricinfo, Dawn Sports, Sky Sports and more — refreshed every 30 minutes
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem 5rem" }}>

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* ── CRICKET NEWS ── */}
        {cricket.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 24 }}>
              🏏 <span className="gradient-text-green">Cricket</span> News
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {cricket.map((item, i) => <NewsCard key={i} item={item} />)}
            </div>
          </section>
        )}

        {/* ── FOOTBALL NEWS ── */}
        {football.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 24 }}>
              ⚽ <span className="gradient-text-blue">Football</span> News
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {football.map((item, i) => <NewsCard key={i} item={item} />)}
            </div>
          </section>
        )}

        <div className="ad-slot" style={{ height: 90, marginBottom: 56 }}>Advertisement</div>

        {/* ── PAKISTAN SPORTS ── */}
        {pakistan.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 24 }}>
              🇵🇰 Pakistan Sports
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {pakistan.map((item, i) => <NewsCard key={i} item={item} />)}
            </div>
          </section>
        )}

        {/* ── OTHER ── */}
        {other.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 24 }}>
              🌍 More Sports
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {other.map((item, i) => <NewsCard key={i} item={item} />)}
            </div>
          </section>
        )}

        {/* Sources */}
        <div style={{ textAlign: "center", paddingTop: 20, borderTop: "1px solid #1e1e2e" }}>
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            News sourced from BBC Sport · ESPN Cricinfo · Dawn Sports · Sky Sports · refreshed every 30 min
          </p>
        </div>

      </div>
    </div>
  );
}
