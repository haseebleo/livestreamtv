import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getKoreanDramas, POSTER } from "@/lib/api/tmdb";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page = "1" } = await searchParams;
  const pg = parseInt(page);
  return {
    title: pg > 1
      ? `Korean Dramas (KDrama) Online — Page ${pg} | LiveStreamTV.pk`
      : "Korean Dramas — Watch KDrama Online | LiveStreamTV.pk",
    description:
      "Watch the best Korean dramas (KDrama) online. Squid Game, Crash Landing on You, Goblin, Vincenzo and more. Full KDrama list with ratings, cast and where to watch.",
    keywords: [
      "Korean drama online", "KDrama", "watch Korean drama", "best Korean drama 2025 2026",
      "Squid Game", "Crash Landing on You", "Korean series online",
      "KDrama list", "Korean drama with English subtitles",
    ],
    openGraph: {
      title: "Korean Dramas (KDrama) Online | LiveStreamTV.pk",
      description: "The complete KDrama catalogue — Squid Game, Goblin, CLOY and thousands more.",
      images: [`${BASE}/api/og?title=Korean+Dramas+Online&type=show&sub=KDrama%2C+Squid+Game+%26+More`],
    },
  };
}

export default async function KoreanDramasPage({ searchParams }: PageProps) {
  const { page = "1" } = await searchParams;
  const pg = Math.max(1, parseInt(page));
  const { results: shows, totalPages } = await getKoreanDramas(pg);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Korean Dramas Online",
    description: "Complete KDrama catalogue",
    url: `${BASE}/korean-dramas`,
    inLanguage: "ko",
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(244,114,182,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 14 }}>🇰🇷</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Korean <span style={{ background: "linear-gradient(135deg,#f472b6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dramas</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>
            The complete KDrama catalogue — Squid Game, Goblin, Crash Landing on You and thousands more
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem 5rem" }}>
        <div className="ad-slot" style={{ height: 90, marginBottom: 32 }}>Advertisement</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16, marginBottom: 40 }}>
          {shows.map((show: { id: number; name: string; poster_path: string | null; vote_average: number; first_air_date: string }) => {
            const poster = POSTER(show.poster_path);
            const year = show.first_air_date?.slice(0, 4);
            return (
              <Link key={show.id} href={`/tv-shows/${show.id}`} style={{ textDecoration: "none" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", borderRadius: 10, overflow: "hidden", background: "#141422", border: "1px solid #1e1e2e", marginBottom: 8 }}>
                  {poster ? (
                    <Image src={poster} alt={show.name} fill style={{ objectFit: "cover" }} sizes="150px" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: "linear-gradient(135deg,#1a0810,#0f0508)" }}>
                      <span style={{ fontSize: 28, marginBottom: 8 }}>🇰🇷</span>
                      <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>{show.name}</span>
                    </div>
                  )}
                  <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.8)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ color: "#f5c518", fontSize: 10 }}>★</span>
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{show.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{show.name}</p>
                {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
          {pg > 1 && <Link href={`/korean-dramas?page=${pg - 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>← Prev</Link>}
          {[pg - 1, pg, pg + 1, pg + 2].filter((p) => p > 0 && p <= totalPages).map((p) => (
            <Link key={p} href={`/korean-dramas?page=${p}`} style={{ padding: "8px 14px", background: p === pg ? "rgba(244,114,182,0.2)" : "rgba(255,255,255,0.06)", border: p === pg ? "1px solid rgba(244,114,182,0.4)" : "1px solid #1e1e2e", color: p === pg ? "#f472b6" : "#fff", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{p}</Link>
          ))}
          {pg < totalPages && <Link href={`/korean-dramas?page=${pg + 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Next →</Link>}
        </div>

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Watch Korean Dramas Online</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8 }}>
            Korean dramas (KDrama) have a huge and passionate fanbase across Pakistan and the world. From global hits like <strong style={{ color: "#fff" }}>Squid Game</strong> and <strong style={{ color: "#fff" }}>Crash Landing on You</strong> to romantic classics like <strong style={{ color: "#fff" }}>Goblin</strong> — find every KDrama with full cast, plot, ratings and where to watch online.
          </p>
        </div>
      </div>
    </div>
  );
}
