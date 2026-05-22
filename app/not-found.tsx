import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — LiveStreamTV.pk",
  robots: { index: false },
};

const QUICK_LINKS = [
  { href: "/",         label: "🏠 Home" },
  { href: "/cricket",  label: "🏏 Cricket" },
  { href: "/football", label: "⚽ Football" },
  { href: "/movies",   label: "🎬 Movies" },
  { href: "/tv-shows", label: "📺 TV Shows" },
  { href: "/live-tv",  label: "📡 Live TV" },
  { href: "/news",     label: "📰 News" },
];

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", background: "#0a0a0a" }}>
      <div style={{ position: "relative", marginBottom: 32 }}>
        <span style={{ fontSize: 120, lineHeight: 1, userSelect: "none", opacity: 0.15, display: "block", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontWeight: 900, color: "#e50914" }}>404</span>
        <span style={{ fontSize: 72, display: "block", position: "relative", zIndex: 1 }}>🏏</span>
      </div>

      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", marginBottom: 12, lineHeight: 1.1 }}>
        Stumped! Page not found.
      </h1>
      <p style={{ color: "#9ca3af", fontSize: 16, maxWidth: 420, marginBottom: 40, lineHeight: 1.6 }}>
        That page doesn&apos;t exist or has been moved. Head back to the pitch and try one of these:
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 48 }}>
        {QUICK_LINKS.map((l) => (
          <Link key={l.href} href={l.href}
            style={{ padding: "8px 18px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            {l.label}
          </Link>
        ))}
      </div>

      <Link href="/"
        style={{ background: "#e50914", color: "#fff", padding: "12px 32px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
        ← Back to Home
      </Link>
    </div>
  );
}
