import type { Metadata } from "next";
import Link from "next/link";
import { DRAMAS, DRAMA_CHANNELS, DRAMA_GENRES, type Drama } from "@/lib/api/dramas";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export const metadata: Metadata = {
  title: "Pakistani Dramas — Watch Geo, ARY, Hum TV Dramas Online",
  description:
    "Watch the best Pakistani dramas online. All episodes from Geo TV, ARY Digital, and Hum TV. Humsafar, Tere Bin, Mere Humsafar, Ishq Murshid and more.",
  keywords: [
    "Pakistani dramas online", "Geo drama list", "ARY drama 2026",
    "Hum TV dramas", "watch Pakistani drama", "urdu drama online",
    "drama episodes online Pakistan",
  ],
  openGraph: {
    title: "Pakistani Dramas — Geo, ARY, Hum TV | LiveStreamTV.pk",
    description: "Watch all Pakistani dramas online — Geo TV, ARY Digital and Hum TV. All episodes, free.",
    images: [`${BASE}/api/og?title=Pakistani+Dramas+Online&type=live&sub=Geo+TV%2C+ARY+Digital%2C+Hum+TV`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${BASE}/api/og?title=Pakistani+Dramas+Online&type=live&sub=Geo+TV%2C+ARY+Digital%2C+Hum+TV`],
  },
};

const CHANNEL_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "Geo":     { color: "#34d399", bg: "rgba(0,179,65,0.1)",  border: "rgba(0,179,65,0.25)"  },
  "ARY":     { color: "#f87171", bg: "rgba(229,9,20,0.1)",  border: "rgba(229,9,20,0.25)"  },
  "Hum TV":  { color: "#a78bfa", bg: "rgba(124,58,237,0.1)",border: "rgba(124,58,237,0.25)"},
  "Express": { color: "#fcd34d", bg: "rgba(245,158,11,0.1)",border: "rgba(245,158,11,0.25)"},
};

function DramaCard({ drama }: { drama: Drama }) {
  const ch = CHANNEL_STYLES[drama.channel] ?? CHANNEL_STYLES["Geo"];
  return (
    <Link href={`/watch/drama/${drama.slug}/episode/1`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}>
        {/* Thumbnail */}
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#0d0d1a" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={drama.thumbnail}
            alt={drama.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
          {drama.status === "ongoing" && (
            <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(229,9,20,0.9)", borderRadius: 999, padding: "3px 10px" }}>
              <span style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>ON AIR</span>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,20,34,0.9) 0%, transparent 50%)" }} />
        </div>

        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: ch.bg, border: `1px solid ${ch.border}`, color: ch.color }}>
              {drama.channel}
            </span>
            {drama.totalEpisodes && (
              <span style={{ fontSize: 10, color: "#6b7280" }}>{drama.totalEpisodes} eps</span>
            )}
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#6b7280" }}>{drama.year}</span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>{drama.title}</h3>
          <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {drama.synopsis}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
            {drama.genre.slice(0, 3).map((g) => (
              <span key={g} style={{ fontSize: 10, color: "#6b7280", background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a2a", borderRadius: 4, padding: "1px 6px" }}>{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DramasPage() {
  const ongoing   = DRAMAS.filter((d) => d.status === "ongoing");
  const completed = DRAMAS.filter((d) => d.status === "completed");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pakistani Dramas — Geo, ARY, Hum TV",
    description: "Watch Pakistani dramas online. All episodes from Geo TV, ARY Digital and Hum TV.",
    url: `${BASE}/dramas`,
    hasPart: DRAMAS.slice(0, 10).map((d) => ({
      "@type": "TVSeries",
      name: d.title,
      url: `${BASE}/dramas/${d.slug}`,
      description: d.synopsis,
      inLanguage: "ur",
    })),
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 14 }}>🎭</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Pakistani <span style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dramas</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 520, margin: "0 auto 20px" }}>
            Watch the latest and greatest Pakistani dramas from Geo TV, ARY Digital and Hum TV — all in one place
          </p>

          {/* Channel filters */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {DRAMA_CHANNELS.map((ch) => {
              const s = CHANNEL_STYLES[ch];
              return (
                <a key={ch} href={`#${ch.toLowerCase().replace(" ", "-")}`}
                  style={{ padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: s.bg, border: `1px solid ${s.border}`, color: s.color, textDecoration: "none" }}>
                  {ch}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem 5rem" }}>
        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* Currently airing */}
        {ongoing.length > 0 && (
          <section style={{ marginBottom: 56 }} id="on-air">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ width: 10, height: 10, background: "#e50914", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px rgba(229,9,20,0.6)" }} />
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>Currently Airing</h2>
              <span style={{ background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>ON AIR</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {ongoing.map((d) => <DramaCard key={d.slug} drama={d} />)}
            </div>
          </section>
        )}

        {/* By channel */}
        {DRAMA_CHANNELS.map((ch) => {
          const dramas = completed.filter((d) => d.channel === ch);
          if (dramas.length === 0) return null;
          const s = CHANNEL_STYLES[ch];
          return (
            <section key={ch} id={ch.toLowerCase().replace(" ", "-")} style={{ marginBottom: 56 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{ width: 4, height: 24, background: s.color, borderRadius: 2 }} />
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{ch} Dramas</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {dramas.map((d) => <DramaCard key={d.slug} drama={d} />)}
              </div>
            </section>
          );
        })}

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* Genre tags for SEO */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Browse by Genre</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {DRAMA_GENRES.map((g) => (
              <span key={g} style={{ padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", color: "#d1d5db" }}>
                {g} Dramas
              </span>
            ))}
          </div>
        </section>

        {/* SEO text block */}
        <section style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Watch Pakistani Dramas Online Free</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8 }}>
            LiveStreamTV.pk is your go-to destination for watching Pakistani dramas online. We feature dramas from Pakistan&apos;s top channels including{" "}
            <strong style={{ color: "#34d399" }}>Geo TV</strong>,{" "}
            <strong style={{ color: "#f87171" }}>ARY Digital</strong>, and{" "}
            <strong style={{ color: "#a78bfa" }}>Hum TV</strong>. From timeless classics like <em>Humsafar</em> and <em>Zindagi Gulzar Hai</em> to modern hits like <em>Tere Bin</em> and <em>Ishq Murshid</em>, find all your favorite Pakistani dramas with episode guides and watch links.
          </p>
        </section>
      </div>
    </div>
  );
}
