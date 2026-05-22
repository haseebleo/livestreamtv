export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieDetails, getSimilarMovies, POSTER, BACKDROP } from "@/lib/api/tmdb";
import { db } from "@/lib/db";
import { StreamPlayer, type VideoServer } from "@/components/ui/stream-player";
import { WatchlistButton } from "@/components/ui/watchlist-button";
import { WatchTracker } from "@/components/ui/watch-tracker";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(parseInt(id));
  if (!movie) return { title: "Watch Movie" };
  const year = movie.release_date?.slice(0, 4);
  return {
    title: `Watch ${movie.title}${year ? ` (${year})` : ""} Online Free`,
    description: `Watch ${movie.title} online free in HD. ${movie.overview?.slice(0, 120) ?? ""}`,
    robots: { index: true, follow: true },
    openGraph: {
      title: `Watch ${movie.title} Online | LiveStreamTV.pk`,
      description: movie.overview ?? "",
      images: POSTER(movie.poster_path) ? [POSTER(movie.poster_path)!] : [],
    },
  };
}

export default async function WatchMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = parseInt(id);

  const [movie, similar, videoLinks] = await Promise.all([
    getMovieDetails(movieId),
    getSimilarMovies(movieId),
    db.videoLink.findMany({
      where: { contentId: String(movieId), contentType: "movie", isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  if (!movie) notFound();

  const poster   = POSTER(movie.poster_path);
  const backdrop = BACKDROP(movie.backdrop_path);
  const year     = movie.release_date?.slice(0, 4);
  const runtime  = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  const servers: VideoServer[] = videoLinks.map((v) => ({
    id: v.id,
    serverName: v.serverName,
    embedUrl: v.embedUrl,
    quality: v.quality,
    lang: v.lang,
  }));

  const cast = movie.credits?.cast?.slice(0, 12) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: poster,
    datePublished: movie.release_date,
    url: `${BASE}/watch/movie/${id}`,
    aggregateRating: movie.vote_average > 0 ? {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average.toFixed(1),
      ratingCount: movie.vote_count ?? 1,
      bestRating: "10",
    } : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", paddingTop: 64 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Backdrop */}
      {backdrop && (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.07, pointerEvents: "none" }}>
          <Image src={backdrop} alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 1rem 5rem", position: "relative", zIndex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#6b7280", marginBottom: 16, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/movies" style={{ color: "#6b7280", textDecoration: "none" }}>Movies</Link>
          <span>/</span>
          <Link href={`/movies/${id}`} style={{ color: "#6b7280", textDecoration: "none" }}>{movie.title}</Link>
          <span>/</span>
          <span style={{ color: "#9ca3af" }}>Watch</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>

          {/* ── LEFT: Player ── */}
          <div>
            <WatchTracker
              id={`movie_${id}`}
              title={movie.title}
              posterUrl={poster}
              href={`/watch/movie/${id}`}
              type="movie"
            />
            <StreamPlayer servers={servers} title={movie.title} posterUrl={poster} />

            {/* Movie title under player */}
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 10 }}>
                {movie.genres?.slice(0, 3).map((g: { id: number; name: string }) => (
                  <span key={g.id} style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.25)", color: "#f87171" }}>{g.name}</span>
                ))}
                {year && <span style={{ fontSize: 12, color: "#6b7280" }}>{year}</span>}
                {runtime && <span style={{ fontSize: 12, color: "#6b7280" }}>{runtime}</span>}
                {movie.vote_average > 0 && (
                  <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: 700 }}>
                    <span style={{ color: "#f5c518" }}>★</span>
                    <span style={{ color: "#fff" }}>{movie.vote_average.toFixed(1)}</span>
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 900, color: "#fff", marginBottom: 10 }}>
                {movie.title}
              </h1>
              {movie.overview && (
                <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8, marginBottom: 16 }}>{movie.overview}</p>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <WatchlistButton
                  id={`movie_${id}`}
                  title={movie.title}
                  posterUrl={poster}
                  href={`/watch/movie/${id}`}
                  type="movie"
                  style={{ fontSize: 13, padding: "9px 18px" }}
                />
                <Link href={`/movies/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: "1px solid #2a2a2a", background: "rgba(255,255,255,0.04)", color: "#9ca3af", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  ℹ More Info
                </Link>
              </div>
            </div>

            <div className="ad-slot" style={{ height: 90, margin: "24px 0" }}>Advertisement</div>

            {/* Cast */}
            {cast.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Cast</h2>
                <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                  {cast.map((p: { id: number; name: string; character: string; profile_path: string | null }) => (
                    <div key={p.id} style={{ flexShrink: 0, textAlign: "center", width: 72 }}>
                      {p.profile_path ? (
                        <Image src={`https://image.tmdb.org/t/p/w185${p.profile_path}`} alt={p.name} width={60} height={60} style={{ borderRadius: "50%", border: "2px solid #1e1e2e", margin: "0 auto 4px" }} />
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#141422", border: "2px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px", fontSize: 22 }}>👤</div>
                      )}
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#d1d5db", lineHeight: 1.3 }}>{p.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside>
            {/* Poster */}
            {poster && (
              <div style={{ marginBottom: 20 }}>
                <Image src={poster} alt={movie.title} width={300} height={450} style={{ width: "100%", height: "auto", borderRadius: 12, border: "1px solid #1e1e2e" }} />
              </div>
            )}

            {/* Info */}
            <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Release", value: movie.release_date },
                  { label: "Runtime", value: runtime },
                  { label: "Language", value: movie.original_language?.toUpperCase() },
                  { label: "Status", value: movie.status },
                ].filter((r) => r.value).map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>{row.label}</span>
                    <span style={{ color: "#d1d5db", fontWeight: 700 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 12 }}>More Like This</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {similar.slice(0, 6).map((m: { id: number; title: string; poster_path: string | null; vote_average: number }) => (
                    <Link key={m.id} href={`/watch/movie/${m.id}`} style={{ display: "flex", gap: 10, textDecoration: "none" }}>
                      {POSTER(m.poster_path) ? (
                        <Image src={POSTER(m.poster_path)!} alt={m.title} width={50} height={75} style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 50, height: 75, borderRadius: 6, background: "#141422", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎬</div>
                      )}
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>{m.title}</p>
                        <span style={{ fontSize: 10, color: "#f5c518" }}>★ {m.vote_average.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
