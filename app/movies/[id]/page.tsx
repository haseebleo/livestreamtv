import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getMovieDetails,
  getMovieWatchProviders,
  getSimilarMovies,
  getTrendingMovies,
  getMovieTrailerKey,
  POSTER,
  BACKDROP,
} from "@/lib/api/tmdb";
import { JsonLd } from "@/components/seo/json-ld";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(parseInt(id));
  if (!movie) {
    return { title: "Movie Not Found" };
  }
  const poster = POSTER(movie.poster_path, "w500");
  return {
    title: `${movie.title} (${movie.release_date ? new Date(movie.release_date).getFullYear() : ""}) — Where to Watch`,
    description: movie.overview ?? `Find where to watch ${movie.title} online.`,
    openGraph: {
      title: `${movie.title} | LiveStreamTV.pk`,
      description: movie.overview ?? "",
      images: poster ? [{ url: poster, width: 500, height: 750 }] : [],
    },
  };
}

export async function generateStaticParams() {
  const movies = await getTrendingMovies();
  return movies.slice(0, 20).map((m: { id: number }) => ({ id: String(m.id) }));
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id);
  const [movie, providers, similar] = await Promise.all([
    getMovieDetails(movieId),
    getMovieWatchProviders(movieId),
    getSimilarMovies(movieId),
  ]);

  if (!movie) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🎬</p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", marginBottom: 8 }}>Movie Not Found</h1>
          <p style={{ color: "#b3b3b3", marginBottom: 24 }}>This movie could not be loaded.</p>
          <Link href="/movies" style={{ background: "#e50914", color: "#fff", padding: "10px 24px", borderRadius: 6, fontWeight: 700, textDecoration: "none" }}>
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  const backdrop = BACKDROP(movie.backdrop_path);
  const poster = POSTER(movie.poster_path, "w500");
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const streamFlat: { provider_name: string; logo_path: string }[] = providers?.flatrate ?? [];
  const streamFree: { provider_name: string; logo_path: string }[] = providers?.free ?? [];
  const allProviders = [...streamFlat, ...streamFree];
  const cast: { id: number; name: string; character: string; profile_path: string | null }[] =
    movie.credits?.cast?.slice(0, 15) ?? [];
  const trailerKey = getMovieTrailerKey(movie);

  const movieJsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: poster,
    datePublished: movie.release_date,
    aggregateRating: movie.vote_average
      ? { "@type": "AggregateRating", ratingValue: movie.vote_average.toFixed(1), ratingCount: movie.vote_count ?? 1, bestRating: "10" }
      : undefined,
  };

  return (
    <>
      <JsonLd data={movieJsonLd} />
      <div style={{ minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
          {backdrop ? (
            <Image src={backdrop} alt={movie.title} fill priority style={{ objectFit: "cover", objectPosition: "center 20%" }} sizes="100vw" />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0a0a, #0a0a1a)" }} />
          )}
          <div className="hero-gradient" style={{ position: "absolute", inset: 0 }} aria-hidden="true" />
          {/* Side gradient for text readability */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, transparent 100%)" }} aria-hidden="true" />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>

          {/* ── DETAILS CARD ── */}
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: -160,
              position: "relative",
              zIndex: 10,
              flexWrap: "wrap",
              padding: "0 0 3rem",
            }}
          >
            {/* Poster */}
            <div style={{ flexShrink: 0 }}>
              {poster ? (
                <Image
                  src={poster}
                  alt={movie.title}
                  width={200}
                  height={300}
                  style={{ borderRadius: 10, border: "2px solid #2a2a2a", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    width: 200,
                    height: 300,
                    borderRadius: 10,
                    background: "#1c1c1c",
                    border: "2px solid #2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                  }}
                  aria-hidden="true"
                >
                  🎬
                </div>
              )}
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: 160 }}>
              {/* Genres */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {movie.genres?.map((g: { id: number; name: string }) => (
                  <Link
                    key={g.id}
                    href={`/movies?genre=${g.id}`}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: "rgba(229,9,20,0.12)",
                      border: "1px solid rgba(229,9,20,0.25)",
                      color: "#f87171",
                      textDecoration: "none",
                    }}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>

              <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 900, color: "#ffffff", marginBottom: 8 }}>
                {movie.title}
              </h1>

              {movie.tagline && (
                <p style={{ fontSize: 14, color: "#b3b3b3", fontStyle: "italic", marginBottom: 12 }}>{movie.tagline}</p>
              )}

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                {movie.vote_average > 0 && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 15, fontWeight: 700 }}>
                    <span style={{ color: "#f5c518" }}>★</span>
                    <span style={{ color: "#ffffff" }}>{movie.vote_average.toFixed(1)}</span>
                    <span style={{ color: "#6b7280", fontSize: 12 }}>/ 10</span>
                  </span>
                )}
                {year && <span style={{ color: "#b3b3b3", fontSize: 14 }}>{year}</span>}
                {runtime && <span style={{ color: "#b3b3b3", fontSize: 14 }}>{runtime}</span>}
              </div>

              {/* Where to watch */}
              {allProviders.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Where to Watch
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {allProviders.map((p) => (
                      <div
                        key={p.provider_name}
                        title={p.provider_name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          overflow: "hidden",
                          border: "1px solid #2a2a2a",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          width={40}
                          height={40}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <p style={{ fontSize: 14, color: "#b3b3b3", lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
                  {movie.overview}
                </p>
              )}

              {/* Watch Now button */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href={`/watch/movie/${id}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#e50914", color: "#fff", padding: "14px 32px", borderRadius: 8, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 0 24px rgba(229,9,20,0.4)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  Watch Now — Free
                </Link>
                <Link
                  href="/movies"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid #2a2a2a", color: "#d1d5db", padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
                >
                  ← All Movies
                </Link>
              </div>
            </div>
          </div>

          {/* ── TRAILER ── */}
          {trailerKey && (
            <section style={{ paddingBottom: "2rem" }} aria-label="Trailer">
              <div className="section-divider" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 16 }}>
                🎬 Watch Trailer — {movie.title}
              </h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 14, overflow: "hidden", background: "#000", maxWidth: 800 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  title={`${movie.title} Official Trailer`}
                  loading="lazy"
                />
              </div>
            </section>
          )}

          {/* ── CAST ── */}
          {cast.length > 0 && (
            <section style={{ paddingBottom: "3rem" }} aria-label="Cast">
              <div className="section-divider" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 16 }}>Cast</h2>
              <div className="scroll-row">
                {cast.map((person) => {
                  const profileUrl = person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null;
                  return (
                    <div key={person.id} style={{ flexShrink: 0, width: 90, textAlign: "center" }}>
                      {profileUrl ? (
                        <Image
                          src={profileUrl}
                          alt={person.name}
                          width={80}
                          height={80}
                          style={{ borderRadius: "50%", border: "2px solid #2a2a2a", margin: "0 auto 6px" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "#1c1c1c",
                            border: "2px solid #2a2a2a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 6px",
                            fontSize: 28,
                          }}
                          aria-hidden="true"
                        >
                          👤
                        </div>
                      )}
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>{person.name}</p>
                      <p style={{ fontSize: 10, color: "#6b7280", marginTop: 2, lineHeight: 1.3 }}>{person.character}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── AD SLOT ── */}
          <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

          {/* ── SIMILAR MOVIES ── */}
          {similar.length > 0 && (
            <section style={{ paddingBottom: "4rem" }} aria-label="Similar movies">
              <div className="section-divider" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 16 }}>More Like This</h2>
              <div className="scroll-row">
                {similar.map((m: {
                  id: number;
                  title: string;
                  poster_path: string | null;
                  vote_average: number;
                  release_date: string;
                }) => {
                  const p = POSTER(m.poster_path);
                  return (
                    <Link key={m.id} href={`/watch/movie/${m.id}`} className="poster-card" aria-label={m.title}>
                      <div style={{ width: 150, height: 225, borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", position: "relative" }}>
                        {p ? (
                          <Image src={p} alt={m.title} width={150} height={225} style={{ objectFit: "cover", width: "100%", height: "100%" }} sizes="150px" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: `linear-gradient(135deg, hsl(${(m.id * 47) % 360} 30% 15%), hsl(${(m.id * 83) % 360} 30% 10%))` }}>
                            <span style={{ fontSize: 28, marginBottom: 6 }} aria-hidden="true">🎬</span>
                            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{m.title}</span>
                          </div>
                        )}
                        <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                          <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{m.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                      <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
