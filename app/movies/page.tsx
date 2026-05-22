import type { Metadata } from "next";
import Link from "next/link";
import { getPopularMovies, getMoviesByGenre, MOVIE_GENRES, POSTER } from "@/lib/api/tmdb";
import { JsonLd } from "@/components/seo/json-ld";
import { ContentCard } from "@/components/ui/content-card";

interface PageProps {
  searchParams: Promise<{ genre?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: "Movies Streaming Guide — Where to Watch Any Movie",
  description:
    "Find where to stream any movie online. Netflix, Amazon Prime, Disney+, HBO Max and more. 10,000+ movies with streaming info updated daily.",
  openGraph: {
    title: "Movies Streaming Guide | LiveStreamTV.pk",
    description: "Find where to stream any movie — Netflix, Disney+, HBO Max and more.",
  },
};

const streamingPlatforms = [
  { name: "Netflix", color: "#dc2626", emoji: "🔴", url: "https://netflix.com", desc: "Stream movies & original series" },
  { name: "Disney+", color: "#1d4ed8", emoji: "🏰", url: "https://disneyplus.com", desc: "Disney, Marvel, Star Wars & more" },
  { name: "Amazon Prime", color: "#d97706", emoji: "📦", url: "https://primevideo.com", desc: "Prime Originals and more" },
  { name: "HBO Max", color: "#7e22ce", emoji: "🎭", url: "https://max.com", desc: "HBO originals, DC, Warner" },
  { name: "Paramount+", color: "#2563eb", emoji: "⛰️", url: "https://paramountplus.com", desc: "CBS, Paramount originals" },
  { name: "Apple TV+", color: "#374151", emoji: "🍎", url: "https://tv.apple.com", desc: "Apple original films & series" },
];

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const genreId = params.genre ? parseInt(params.genre) : null;
  const page = params.page ? parseInt(params.page) : 1;

  const movies = genreId
    ? await getMoviesByGenre(genreId, page)
    : await getPopularMovies(page);

  const activeGenre = MOVIE_GENRES.find((g) => g.id === genreId);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://livestreamtv.pk" },
      { "@type": "ListItem", position: 2, name: "Movies", item: "https://livestreamtv.pk/movies" },
      ...(activeGenre
        ? [{ "@type": "ListItem", position: 3, name: activeGenre.name, item: `https://livestreamtv.pk/movies?genre=${genreId}` }]
        : []),
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div style={{ minHeight: "100vh", paddingTop: 80 }}>

        {/* ── HEADER ── */}
        <div
          style={{
            position: "relative",
            padding: "3rem 1rem 2rem",
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
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              {activeGenre ? (
                <>{activeGenre.name} <span className="gradient-text">Movies</span></>
              ) : (
                <>Movies <span className="gradient-text">Streaming Guide</span></>
              )}
            </h1>
            <p style={{ color: "#b3b3b3", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Find which streaming platform hosts any movie — updated daily
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem 5rem" }}>

          {/* ── GENRE PILLS ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            <Link
              href="/movies"
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                background: !genreId ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.04)",
                border: !genreId ? "1px solid rgba(229,9,20,0.3)" : "1px solid #2a2a2a",
                color: !genreId ? "#f87171" : "#b3b3b3",
                textDecoration: "none",
              }}
            >
              All
            </Link>
            {MOVIE_GENRES.map((g) => (
              <Link
                key={g.id}
                href={`/movies?genre=${g.id}`}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  background: genreId === g.id ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.04)",
                  border: genreId === g.id ? "1px solid rgba(229,9,20,0.3)" : "1px solid #2a2a2a",
                  color: genreId === g.id ? "#f87171" : "#b3b3b3",
                  textDecoration: "none",
                }}
              >
                {g.name}
              </Link>
            ))}
          </div>

          {/* ── AD SLOT ── */}
          <div className="ad-slot" style={{ height: 90, marginBottom: 24 }}>Advertisement</div>

          {/* ── MOVIES GRID ── */}
          <div className="content-grid" style={{ marginBottom: 48 }}>
            {movies.map((movie: {
              id: number;
              title: string;
              poster_path: string | null;
              vote_average: number;
              release_date: string;
            }) => (
              <ContentCard
                key={movie.id}
                title={movie.title}
                posterUrl={POSTER(movie.poster_path)}
                href={`/watch/movie/${movie.id}`}
                year={movie.release_date ? new Date(movie.release_date).getFullYear() : undefined}
                rating={movie.vote_average}
              />
            ))}
          </div>

          {/* ── PAGINATION ── */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
            {page > 1 && (
              <Link
                href={genreId ? `/movies?genre=${genreId}&page=${page - 1}` : `/movies?page=${page - 1}`}
                style={{
                  padding: "8px 20px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid #2a2a2a",
                  color: "#ffffff",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ← Previous
              </Link>
            )}
            {[page - 1, page, page + 1, page + 2].filter((p) => p > 0 && p <= 500).map((p) => (
              <Link
                key={p}
                href={genreId ? `/movies?genre=${genreId}&page=${p}` : `/movies?page=${p}`}
                style={{
                  padding: "8px 14px",
                  background: p === page ? "#e50914" : "rgba(255,255,255,0.06)",
                  border: p === page ? "1px solid #e50914" : "1px solid #2a2a2a",
                  color: "#ffffff",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {p}
              </Link>
            ))}
            <Link
              href={genreId ? `/movies?genre=${genreId}&page=${page + 1}` : `/movies?page=${page + 1}`}
              style={{
                padding: "8px 20px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid #2a2a2a",
                color: "#ffffff",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Next →
            </Link>
          </div>

          {/* ── AD SLOT ── */}
          <div className="ad-slot" style={{ height: 90, marginBottom: 48 }}>Advertisement</div>

          {/* ── WHERE TO WATCH ── */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff", marginBottom: 20 }}>Where to Watch</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {streamingPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: 14,
                    background: "#1c1c1c",
                    border: "1px solid #2a2a2a",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: platform.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {platform.emoji}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: "#ffffff", fontSize: 14 }}>{platform.name}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{platform.desc}</p>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: 12, flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link
              href="/tv-shows"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #2a2a2a",
                color: "#ffffff",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              📺 Also check TV Shows →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
