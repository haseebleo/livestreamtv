import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  getTrendingMovies,
  getTrendingShows,
  getNowPlayingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  POSTER,
  BACKDROP,
} from "@/lib/api/tmdb";
import { getMockCricketMatches, getMockFootballMatches } from "@/lib/api/sports";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "LiveStreamTV.pk — Live Cricket, Football Scores & Streaming Guide",
  description:
    "Watch live cricket scores, football results, and find where to stream movies & TV shows online. Pakistan's #1 sports and entertainment hub.",
  openGraph: {
    title: "LiveStreamTV.pk — Live Sports & Streaming Guide",
    description: "Live cricket scores, football results, and streaming guides for movies & TV shows.",
    type: "website",
    url: "https://livestreamtv.pk",
    images: [{ url: "https://livestreamtv.pk/og-image.jpg", width: 1200, height: 630 }],
  },
};

// ── SKELETON COMPONENTS ──

function SkeletonPosterRow() {
  return (
    <div className="scroll-row">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ flexShrink: 0, width: 150 }}>
          <div className="skeleton" style={{ width: 150, height: 225, borderRadius: 10 }} />
          <div className="skeleton" style={{ width: "80%", height: 12, marginTop: 8, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: "50%", height: 10, marginTop: 4, borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

// ── DATA SECTIONS ──

async function TrendingMoviesRow() {
  const movies = await getTrendingMovies();
  return (
    <div className="scroll-row">
      {movies.slice(0, 12).map((movie: {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date: string;
      }) => {
        const poster = POSTER(movie.poster_path);
        const year = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : "";
        return (
          <Link key={movie.id} href={`/movies/${movie.id}`} className="poster-card" aria-label={movie.title}>
            <div
              style={{
                width: 150,
                height: 225,
                borderRadius: 10,
                overflow: "hidden",
                background: "#1c1c1c",
                border: "1px solid #2a2a2a",
                position: "relative",
              }}
            >
              {poster ? (
                <Image
                  src={poster}
                  alt={movie.title}
                  width={150}
                  height={225}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  sizes="150px"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    textAlign: "center",
                    background: `linear-gradient(135deg, hsl(${(movie.id * 47) % 360} 30% 15%), hsl(${(movie.id * 83) % 360} 30% 10%))`,
                  }}
                >
                  <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">🎬</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{movie.title}</span>
                </div>
              )}
              {/* Rating badge */}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(4px)",
                  borderRadius: 4,
                  padding: "2px 5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{movie.title}</p>
            {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
          </Link>
        );
      })}
    </div>
  );
}

async function TrendingShowsRow() {
  const shows = await getTrendingShows();
  return (
    <div className="scroll-row">
      {shows.slice(0, 12).map((show: {
        id: number;
        name: string;
        poster_path: string | null;
        vote_average: number;
        first_air_date: string;
      }) => {
        const poster = POSTER(show.poster_path);
        const year = show.first_air_date ? new Date(show.first_air_date).getFullYear().toString() : "";
        return (
          <Link key={show.id} href={`/tv-shows/${show.id}`} className="poster-card" aria-label={show.name}>
            <div
              style={{
                width: 150,
                height: 225,
                borderRadius: 10,
                overflow: "hidden",
                background: "#1c1c1c",
                border: "1px solid #2a2a2a",
                position: "relative",
              }}
            >
              {poster ? (
                <Image
                  src={poster}
                  alt={show.name}
                  width={150}
                  height={225}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  sizes="150px"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    textAlign: "center",
                    background: `linear-gradient(135deg, hsl(${(show.id * 53) % 360} 30% 15%), hsl(${(show.id * 79) % 360} 30% 10%))`,
                  }}
                >
                  <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">📺</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{show.name}</span>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(4px)",
                  borderRadius: 4,
                  padding: "2px 5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{show.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{show.name}</p>
            {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
          </Link>
        );
      })}
    </div>
  );
}

async function NowPlayingRow() {
  const movies = await getNowPlayingMovies();
  return (
    <div className="scroll-row">
      {movies.slice(0, 12).map((movie: {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date: string;
      }) => {
        const poster = POSTER(movie.poster_path);
        return (
          <Link key={movie.id} href={`/movies/${movie.id}`} className="poster-card" aria-label={movie.title}>
            <div
              style={{
                width: 150,
                height: 225,
                borderRadius: 10,
                overflow: "hidden",
                background: "#1c1c1c",
                border: "1px solid #2a2a2a",
                position: "relative",
              }}
            >
              {poster ? (
                <Image src={poster} alt={movie.title} width={150} height={225} style={{ objectFit: "cover", width: "100%", height: "100%" }} sizes="150px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: `linear-gradient(135deg, hsl(${(movie.id * 61) % 360} 30% 15%), hsl(${(movie.id * 97) % 360} 30% 10%))` }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">🎭</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{movie.title}</span>
                </div>
              )}
              <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{movie.title}</p>
          </Link>
        );
      })}
    </div>
  );
}

async function ActionMoviesRow() {
  const movies = await getMoviesByGenre(28);
  return (
    <div className="scroll-row">
      {movies.slice(0, 12).map((movie: {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date: string;
      }) => {
        const poster = POSTER(movie.poster_path);
        return (
          <Link key={movie.id} href={`/movies/${movie.id}`} className="poster-card" aria-label={movie.title}>
            <div style={{ width: 150, height: 225, borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", position: "relative" }}>
              {poster ? (
                <Image src={poster} alt={movie.title} width={150} height={225} style={{ objectFit: "cover", width: "100%", height: "100%" }} sizes="150px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: "linear-gradient(135deg, #1a0a0a, #0a0a1a)" }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">💥</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{movie.title}</span>
                </div>
              )}
              <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{movie.title}</p>
          </Link>
        );
      })}
    </div>
  );
}

async function TopRatedRow() {
  const movies = await getTopRatedMovies();
  return (
    <div className="scroll-row">
      {movies.slice(0, 12).map((movie: {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date: string;
      }) => {
        const poster = POSTER(movie.poster_path);
        return (
          <Link key={movie.id} href={`/movies/${movie.id}`} className="poster-card" aria-label={movie.title}>
            <div style={{ width: 150, height: 225, borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", position: "relative" }}>
              {poster ? (
                <Image src={poster} alt={movie.title} width={150} height={225} style={{ objectFit: "cover", width: "100%", height: "100%" }} sizes="150px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: "linear-gradient(135deg, #0a1a0a, #1a1a0a)" }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">🏆</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{movie.title}</span>
                </div>
              )}
              <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{movie.title}</p>
          </Link>
        );
      })}
    </div>
  );
}

async function HeroSection() {
  const movies = await getTrendingMovies();
  const hero = movies?.[0];
  const backdropUrl = hero ? BACKDROP(hero.backdrop_path) : null;

  return (
    <section
      style={{
        position: "relative",
        height: "70vh",
        minHeight: 400,
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
      aria-label="Featured movie hero"
    >
      {/* Background image */}
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt={hero?.title ?? "Featured"}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="100vw"
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 50%, #0a1a0a 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="hero-gradient"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 2rem 3rem",
          maxWidth: 700,
        }}
      >
        {hero ? (
          <>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(229,9,20,0.15)",
                border: "1px solid rgba(229,9,20,0.3)",
                borderRadius: 4,
                padding: "3px 10px",
                marginBottom: 12,
              }}
            >
              <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} aria-hidden="true" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em" }}>TRENDING TODAY</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.1,
                marginBottom: 12,
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              {hero.title}
            </h1>
            {hero.overview && (
              <p
                style={{
                  fontSize: 14,
                  color: "#b3b3b3",
                  maxWidth: 480,
                  lineHeight: 1.6,
                  marginBottom: 20,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {hero.overview}
              </p>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href={`/movies/${hero.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 24px",
                  background: "#e50914",
                  color: "#ffffff",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                ▶ Watch Now
              </Link>
              <Link
                href={`/movies/${hero.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 24px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#ffffff",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                ℹ More Info
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 900,
                color: "#ffffff",
                marginBottom: 16,
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              <span style={{ color: "#e50914" }}>LiveStream</span>TV.pk
            </h1>
            <p style={{ color: "#b3b3b3", fontSize: 16, marginBottom: 20 }}>
              Pakistan&apos;s #1 sports and streaming guide
            </p>
            <Link
              href="/movies"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                background: "#e50914",
                color: "#ffffff",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Explore Movies
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

// ── MAIN PAGE ──

export default async function Home() {
  const cricketMatches = getMockCricketMatches();
  const footballMatches = getMockFootballMatches();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LiveStreamTV.pk",
    url: "https://livestreamtv.pk",
    description: "Pakistan's #1 sports and entertainment streaming guide",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://livestreamtv.pk/search?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  const liveCricket = cricketMatches.filter((m) => m.status === "live");
  const liveFootball = footballMatches.filter((m) => m.status === "live");

  const countryFlags: Record<string, string> = {
    Pakistan: "🇵🇰", India: "🇮🇳", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Australia: "🇦🇺",
    "South Africa": "🇿🇦", "New Zealand": "🇳🇿", "West Indies": "🏝️", "Sri Lanka": "🇱🇰",
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      {/* ── HERO ── */}
      <Suspense
        fallback={
          <div
            style={{
              height: "70vh",
              minHeight: 400,
              background: "linear-gradient(135deg, #1a0a0a, #0a0a0a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="skeleton" style={{ width: 300, height: 48 }} />
          </div>
        }
      >
        <HeroSection />
      </Suspense>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>

        {/* ── LIVE NOW ── */}
        <section style={{ paddingTop: "3rem", paddingBottom: "3rem" }} aria-label="Live matches">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span className="live-dot" style={{ width: 12, height: 12, background: "#e50914", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              Live Now
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {/* Cricket live cards */}
            {liveCricket.map((match) => (
              <Link
                key={match.id}
                href="/cricket"
                style={{
                  display: "block",
                  background: "#1c1c1c",
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                    <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
                    LIVE
                  </div>
                  <span style={{ background: "rgba(0,112,243,0.12)", border: "1px solid rgba(0,112,243,0.25)", color: "#60a5fa", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                    {match.format}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{countryFlags[match.teams.home.name] ?? ""} {match.teams.home.name}</p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: "#00b341" }}>{match.teams.home.score}</p>
                    <p style={{ fontSize: 11, color: "#6b7280" }}>{match.teams.home.overs} ov</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#6b7280" }}>VS</span>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{match.teams.away.name} {countryFlags[match.teams.away.name] ?? ""}</p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: "#b3b3b3" }}>{match.teams.away.score}</p>
                    <p style={{ fontSize: 11, color: "#6b7280" }}>{match.teams.away.overs} ov</p>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#6b7280" }}>🏆 {match.tournament}</p>
              </Link>
            ))}

            {/* Football live cards */}
            {liveFootball.map((match) => (
              <Link
                key={match.id}
                href="/football"
                style={{
                  display: "block",
                  background: "#1c1c1c",
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#f5c518" }}>{match.leagueLogo} {match.league}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,179,65,0.12)", border: "1px solid rgba(0,179,65,0.3)", color: "#34d399", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                    <span className="live-dot" style={{ width: 6, height: 6, background: "#00b341", borderRadius: "50%", display: "inline-block" }} />
                    {match.minute}&apos;
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{match.homeTeam}</p>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 12px", textAlign: "center", minWidth: 72 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{match.homeScore} – {match.awayScore}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", textAlign: "right" }}>{match.awayTeam}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TRENDING MOVIES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Trending movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              🎬 Trending <span className="gradient-text">Movies</span>
            </h2>
            <Link href="/movies" style={{ fontSize: 13, fontWeight: 700, color: "#e50914", textDecoration: "none" }}>
              See All →
            </Link>
          </div>
          <Suspense fallback={<SkeletonPosterRow />}>
            <TrendingMoviesRow />
          </Suspense>
        </section>

        {/* ── TRENDING SHOWS ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Trending TV shows">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              📺 Trending <span className="gradient-text-blue">Shows</span>
            </h2>
            <Link href="/tv-shows" style={{ fontSize: 13, fontWeight: 700, color: "#0070f3", textDecoration: "none" }}>
              See All →
            </Link>
          </div>
          <Suspense fallback={<SkeletonPosterRow />}>
            <TrendingShowsRow />
          </Suspense>
        </section>

        {/* ── AD SLOT 1 ── */}
        <div className="ad-slot" style={{ height: 90, margin: "0 0 3rem" }}>Advertisement</div>

        {/* ── NOW IN CINEMAS ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Now in cinemas">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              🎭 Now in Cinemas
            </h2>
          </div>
          <Suspense fallback={<SkeletonPosterRow />}>
            <NowPlayingRow />
          </Suspense>
        </section>

        {/* ── ACTION MOVIES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Action movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              💥 Action Movies
            </h2>
            <Link href="/movies?genre=28" style={{ fontSize: 13, fontWeight: 700, color: "#e50914", textDecoration: "none" }}>
              See All →
            </Link>
          </div>
          <Suspense fallback={<SkeletonPosterRow />}>
            <ActionMoviesRow />
          </Suspense>
        </section>

        {/* ── TOP RATED ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Top rated movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              🏆 Top Rated <span className="gradient-text-gold">Movies</span>
            </h2>
            <Link href="/movies" style={{ fontSize: 13, fontWeight: 700, color: "#f5c518", textDecoration: "none" }}>
              See All →
            </Link>
          </div>
          <Suspense fallback={<SkeletonPosterRow />}>
            <TopRatedRow />
          </Suspense>
        </section>

        {/* ── CRICKET SCORES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Cricket scores">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              🏏 <span className="gradient-text-green">Cricket</span> Scores
            </h2>
            <Link href="/cricket" style={{ fontSize: 13, fontWeight: 700, color: "#00b341", textDecoration: "none" }}>
              All Matches →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {cricketMatches.slice(0, 3).map((match) => (
              <Link
                key={match.id}
                href="/cricket"
                style={{ display: "block", background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "#b3b3b3", fontWeight: 600 }}>🏆 {match.tournament}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {match.status === "live" && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                        <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
                        LIVE
                      </span>
                    )}
                    <span style={{ background: "rgba(0,112,243,0.12)", border: "1px solid rgba(0,112,243,0.25)", color: "#60a5fa", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                      {match.format}
                    </span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{countryFlags[match.teams.home.name] ?? ""} {match.teams.home.name}</p>
                    {match.status !== "upcoming" && <p style={{ fontSize: 18, fontWeight: 900, color: "#00b341" }}>{match.teams.home.score}</p>}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#6b7280" }}>VS</span>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{match.teams.away.name} {countryFlags[match.teams.away.name] ?? ""}</p>
                    {match.status !== "upcoming" && <p style={{ fontSize: 18, fontWeight: 900, color: "#b3b3b3" }}>{match.teams.away.score}</p>}
                  </div>
                </div>
                {match.result && <p style={{ fontSize: 11, color: "#00b341", fontWeight: 600, marginTop: 8, borderTop: "1px solid #2a2a2a", paddingTop: 8 }}>✓ {match.result}</p>}
                {match.status === "upcoming" && match.startTime && <p style={{ fontSize: 11, color: "#f5c518", marginTop: 8 }}>🕐 {match.startTime}</p>}
              </Link>
            ))}
          </div>
        </section>

        {/* ── FOOTBALL SCORES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Football scores">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
              ⚽ <span className="gradient-text-blue">Football</span> Scores
            </h2>
            <Link href="/football" style={{ fontSize: 13, fontWeight: 700, color: "#0070f3", textDecoration: "none" }}>
              All Matches →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {footballMatches.slice(0, 3).map((match) => (
              <Link
                key={match.id}
                href="/football"
                style={{ display: "block", background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#f5c518" }}>{match.leagueLogo} {match.league}</span>
                  {match.status === "live" && match.minute && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,179,65,0.12)", border: "1px solid rgba(0,179,65,0.3)", color: "#34d399", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                      <span className="live-dot" style={{ width: 6, height: 6, background: "#00b341", borderRadius: "50%", display: "inline-block" }} />
                      {match.minute}&apos;
                    </span>
                  )}
                  {match.status === "completed" && <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>FT</span>}
                  {match.status === "upcoming" && match.kickoff && <span style={{ fontSize: 11, color: "#f5c518" }}>🕐 {match.kickoff}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{match.homeTeam}</p>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 12px", textAlign: "center", minWidth: 72 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
                      {match.status === "upcoming" ? "–" : `${match.homeScore} – ${match.awayScore}`}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", textAlign: "right" }}>{match.awayTeam}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── AD SLOT 2 ── */}
        <div className="ad-slot" style={{ height: 90, margin: "0 0 3rem" }}>Advertisement</div>

      </div>
    </>
  );
}
