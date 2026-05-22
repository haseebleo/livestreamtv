import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPakistaniMovies, POSTER } from "@/lib/api/tmdb";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page = "1" } = await searchParams;
  const pg = parseInt(page);
  return {
    title: pg > 1
      ? `Pakistani Movies Online — Page ${pg} | LiveStreamTV.pk`
      : "Pakistani Movies — Watch Urdu Films Online Free",
    description:
      "Watch the best Pakistani Urdu movies online. Full list of Pakistani films with cast, reviews and where to watch. Latest and classic Pakistani cinema.",
    keywords: [
      "Pakistani movies online", "Urdu movies", "watch Pakistani films online",
      "Pakistani cinema", "Pakistan movies 2024 2025 2026",
      "Urdu film", "Pakistani movie list", "Pakistani movies free",
    ],
    openGraph: {
      title: "Pakistani Movies Online | LiveStreamTV.pk",
      description: "The complete list of Pakistani Urdu movies with trailers, cast and streaming info.",
      images: [`${BASE}/api/og?title=Pakistani+Movies+Online&type=live&sub=Full+Urdu+Film+Catalogue`],
    },
  };
}

export default async function PakistaniMoviesPage({ searchParams }: PageProps) {
  const { page = "1" } = await searchParams;
  const pg = Math.max(1, parseInt(page));
  const { results: movies, totalPages } = await getPakistaniMovies(pg);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pakistani Movies Online",
    description: "Full catalogue of Pakistani Urdu movies",
    url: `${BASE}/pakistani-movies`,
    inLanguage: "ur",
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,179,65,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 14 }}>🇵🇰</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Pakistani <span style={{ background: "linear-gradient(135deg,#34d399,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Movies</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>
            The complete catalogue of Pakistani Urdu films — trailers, cast, ratings and where to watch
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem 5rem" }}>
        <div className="ad-slot" style={{ height: 90, marginBottom: 32 }}>Advertisement</div>

        {movies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#9ca3af" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🎬</p>
            <p style={{ fontSize: 16 }}>Loading Pakistani movies…</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16, marginBottom: 40 }}>
            {movies.map((movie: { id: number; title: string; poster_path: string | null; vote_average: number; release_date: string }) => {
              const poster = POSTER(movie.poster_path);
              const year = movie.release_date?.slice(0, 4);
              return (
                <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", borderRadius: 10, overflow: "hidden", background: "#141422", border: "1px solid #1e1e2e", marginBottom: 8 }}>
                    {poster ? (
                      <Image src={poster} alt={movie.title} fill style={{ objectFit: "cover" }} sizes="150px" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: "linear-gradient(135deg,#0d1f0d,#0a1a10)" }}>
                        <span style={{ fontSize: 28, marginBottom: 8 }}>🎬</span>
                        <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>{movie.title}</span>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.8)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                      <span style={{ color: "#f5c518", fontSize: 10 }}>★</span>
                      <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,130,60,0.85)", borderRadius: 4, padding: "2px 6px" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>🇵🇰 PK</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{movie.title}</p>
                  {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
          {pg > 1 && (
            <Link href={`/pakistani-movies?page=${pg - 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>← Prev</Link>
          )}
          {[pg - 1, pg, pg + 1, pg + 2].filter((p) => p > 0 && p <= totalPages).map((p) => (
            <Link key={p} href={`/pakistani-movies?page=${p}`} style={{ padding: "8px 14px", background: p === pg ? "rgba(0,179,65,0.2)" : "rgba(255,255,255,0.06)", border: p === pg ? "1px solid rgba(0,179,65,0.4)" : "1px solid #1e1e2e", color: p === pg ? "#34d399" : "#fff", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{p}</Link>
          ))}
          {pg < totalPages && (
            <Link href={`/pakistani-movies?page=${pg + 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Next →</Link>
          )}
        </div>

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* SEO block */}
        <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Pakistani Urdu Movies Online</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8 }}>
            LiveStreamTV.pk hosts the largest catalogue of Pakistani movies online. Find complete information on every Pakistani Urdu film — including cast, synopsis, ratings, trailers, and where to watch legally. From classic Pakistani cinema to the latest 2025-26 releases, we cover Lollywood and independent Pakistani productions.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Link href="/dramas" style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", textDecoration: "none" }}>🎭 Pakistani Dramas →</Link>
            <Link href="/bollywood" style={{ fontSize: 13, fontWeight: 700, color: "#f87171", textDecoration: "none" }}>🎬 Bollywood Movies →</Link>
            <Link href="/turkish-dramas" style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", textDecoration: "none" }}>🇹🇷 Turkish Dramas →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
