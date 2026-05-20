import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  getTrendingMovies, getTrendingShows, getNowPlayingMovies, getTopRatedMovies,
  getMoviesByGenre, getBollywoodMovies, getUrduDramas, getAnimeShows,
  getUpcomingMovies, getComedyMovies, getHorrorMovies, getTopRatedShows,
  POSTER, BACKDROP,
} from "@/lib/api/tmdb";
import { getCurrentMatches, getMatchStatus, formatScore } from "@/lib/api/cricket";
import { getAllRecentMatches, getAllUpcomingMatches, LEAGUE_FLAGS, getMockFootballMatches } from "@/lib/api/football";
import { getLatestNews } from "@/lib/api/news";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

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

// ── SHARED POSTER LIST ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PosterList({ items, type }: { items: any[]; type: "movie" | "show" }) {
  return (
    <div className="scroll-row">
      {items.slice(0, 12).map((item) => {
        const id: number = item.id;
        const title: string = type === "movie" ? item.title : item.name;
        const dateStr: string = type === "movie" ? item.release_date : item.first_air_date;
        const year = dateStr ? new Date(dateStr).getFullYear().toString() : "";
        const poster = POSTER(item.poster_path);
        const href = type === "movie" ? `/movies/${id}` : `/tv-shows/${id}`;
        const rating: number = item.vote_average ?? 0;
        return (
          <Link key={id} href={href} className="poster-card" aria-label={title}>
            <div style={{ width: 150, height: 225, borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", position: "relative" }}>
              {poster ? (
                <Image src={poster} alt={title} width={150} height={225} style={{ objectFit: "cover", width: "100%", height: "100%" }} sizes="150px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: `linear-gradient(135deg, hsl(${(id * 47) % 360} 30% 15%), hsl(${(id * 83) % 360} 30% 10%))` }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">{type === "movie" ? "🎬" : "📺"}</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{title}</span>
                </div>
              )}
              {rating > 0 && (
                <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                  <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
            {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
          </Link>
        );
      })}
    </div>
  );
}

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

// ── ASYNC ROW COMPONENTS ──

async function TrendingMoviesRow() {
  const movies = await getTrendingMovies();
  return <PosterList items={movies} type="movie" />;
}

async function TrendingShowsRow() {
  const shows = await getTrendingShows();
  return <PosterList items={shows} type="show" />;
}

async function NowPlayingRow() {
  const movies = await getNowPlayingMovies();
  return <PosterList items={movies} type="movie" />;
}

async function ActionMoviesRow() {
  const movies = await getMoviesByGenre(28);
  return <PosterList items={movies} type="movie" />;
}

async function TopRatedMoviesRow() {
  const movies = await getTopRatedMovies();
  return <PosterList items={movies} type="movie" />;
}

async function BollywoodRow() {
  const movies = await getBollywoodMovies();
  return <PosterList items={movies} type="movie" />;
}

async function UrduDramasRow() {
  const shows = await getUrduDramas();
  return <PosterList items={shows} type="show" />;
}

async function AnimeRow() {
  const shows = await getAnimeShows();
  return <PosterList items={shows} type="show" />;
}

async function UpcomingMoviesRow() {
  const movies = await getUpcomingMovies();
  return <PosterList items={movies} type="movie" />;
}

async function ComedyMoviesRow() {
  const movies = await getComedyMovies();
  return <PosterList items={movies} type="movie" />;
}

async function HorrorMoviesRow() {
  const movies = await getHorrorMovies();
  return <PosterList items={movies} type="movie" />;
}

async function TopRatedShowsRow() {
  const shows = await getTopRatedShows();
  return <PosterList items={shows} type="show" />;
}

// ── HERO ──

async function HeroSection() {
  const movies = await getTrendingMovies();
  const hero = movies?.[0];
  const backdropUrl = hero ? BACKDROP(hero.backdrop_path) : null;

  return (
    <section style={{ position: "relative", height: "70vh", minHeight: 400, display: "flex", alignItems: "flex-end", overflow: "hidden" }} aria-label="Featured movie hero">
      {backdropUrl ? (
        <Image src={backdropUrl} alt={hero?.title ?? "Featured"} fill priority style={{ objectFit: "cover", objectPosition: "center top" }} sizes="100vw" />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 50%, #0a1a0a 100%)" }} aria-hidden="true" />
      )}
      <div className="hero-gradient" style={{ position: "absolute", inset: 0 }} aria-hidden="true" />
      <div style={{ position: "relative", zIndex: 10, padding: "0 2rem 3rem", maxWidth: 700 }}>
        {hero && (
          <>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 4, padding: "3px 10px", marginBottom: 12 }}>
              <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} aria-hidden="true" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em" }}>TRENDING</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>{hero.title}</h1>
            {hero.overview && (
              <p style={{ fontSize: 14, color: "#b3b3b3", lineHeight: 1.6, marginBottom: 20, maxWidth: 500 }}>{hero.overview.slice(0, 200)}…</p>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href={`/movies/${hero.id}`} style={{ background: "#e50914", color: "#fff", padding: "10px 24px", borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                ▶ More Info
              </Link>
              <Link href="/movies" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "10px 24px", borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                Explore Movies
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── CRICKET SECTION ──

async function CricketSection() {
  const matches = await getCurrentMatches();
  const live = matches.filter((m) => getMatchStatus(m) === "live");
  const recent = matches.filter((m) => getMatchStatus(m) !== "upcoming").slice(0, 3);
  const display = live.length > 0 ? live.slice(0, 3) : recent;

  const FORMAT_COLORS: Record<string, string> = { odi: "#60a5fa", t20: "#a78bfa", test: "#fcd34d" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {display.map((match) => {
        const status = getMatchStatus(match);
        const t1 = match.teams[0] ?? "Team A";
        const t2 = match.teams[1] ?? "Team B";
        const s1 = formatScore(match, t1);
        const s2 = formatScore(match, t2);
        const fmt = match.matchType?.toUpperCase() ?? "MATCH";
        return (
          <Link key={match.id} href="/cricket" style={{ display: "block", background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{match.name}</span>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {status === "live" && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                    <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} /> LIVE
                  </span>
                )}
                <span style={{ background: "rgba(0,112,243,0.12)", border: "1px solid rgba(0,112,243,0.25)", color: FORMAT_COLORS[match.matchType] ?? "#60a5fa", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                  {fmt}
                </span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t1}</p>
                {s1 !== "-" && <p style={{ fontSize: 16, fontWeight: 900, color: "#00b341" }}>{s1}</p>}
              </div>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#6b7280" }}>VS</span>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t2}</p>
                {s2 !== "-" && <p style={{ fontSize: 16, fontWeight: 900, color: "#b3b3b3" }}>{s2}</p>}
              </div>
            </div>
            {status === "completed" && match.status && (
              <p style={{ fontSize: 11, color: "#00b341", fontWeight: 600, marginTop: 8, borderTop: "1px solid #2a2a2a", paddingTop: 8 }}>✓ {match.status}</p>
            )}
            {match.venue && <p style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>📍 {match.venue}</p>}
          </Link>
        );
      })}
    </div>
  );
}

// ── FOOTBALL SECTION ──

async function FootballSection() {
  const matches = await getAllRecentMatches().catch(() => getMockFootballMatches());
  const display = (matches.length > 0 ? matches : getMockFootballMatches()).slice(0, 3);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {display.map((match) => {
        const flag = LEAGUE_FLAGS[match.strLeague] ?? "⚽";
        const isCompleted = match.strStatus === "FT" || match.strStatus === "AET" || match.strStatus === "PEN";
        const isUpcoming = match.strStatus === "NS" || !match.intHomeScore;
        return (
          <Link key={match.idEvent} href="/football" style={{ display: "block", background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#f5c518", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{flag} {match.strLeague}</span>
              {isCompleted && <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 700 }}>FT</span>}
              {isUpcoming && <span style={{ fontSize: 10, color: "#f5c518", fontWeight: 600 }}>🕐 {match.strTime?.slice(0, 5)}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{match.strHomeTeam}</p>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 68 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
                  {isUpcoming ? "–" : `${match.intHomeScore ?? 0} – ${match.intAwayScore ?? 0}`}
                </span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "right" }}>{match.strAwayTeam}</p>
            </div>
            <p style={{ fontSize: 10, color: "#6b7280", marginTop: 8 }}>📅 {match.dateEvent}</p>
          </Link>
        );
      })}
    </div>
  );
}

// ── NEWS SECTION ──

async function NewsSection() {
  const news = await getLatestNews();
  const categoryColors: Record<string, string> = {
    Cricket: "#34d399",
    Football: "#60a5fa",
    Pakistan: "#f59e0b",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
      {news.slice(0, 6).map((item, i) => (
        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${categoryColors[item.category] ?? "#9ca3af"}22`, color: categoryColors[item.category] ?? "#9ca3af", border: `1px solid ${categoryColors[item.category] ?? "#9ca3af"}44` }}>
              {item.category}
            </span>
            <span style={{ fontSize: 10, color: "#6b7280" }}>{item.source}</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 8 }}>{item.title}</p>
          {item.description && <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.description}</p>}
        </a>
      ))}
    </div>
  );
}

// ── SECTION HEADER HELPER ──

function SectionHeader({ emoji, title, accent, href, linkLabel, linkColor = "#e50914" }: {
  emoji: string; title: React.ReactNode; accent?: string; href?: string; linkLabel?: string; linkColor?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{emoji} {title}</h2>
      {href && linkLabel && (
        <Link href={href} style={{ fontSize: 13, fontWeight: 700, color: linkColor, textDecoration: "none" }}>{linkLabel} →</Link>
      )}
    </div>
  );
}

// ── MAIN PAGE ──

export default async function Home() {
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

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      <Suspense fallback={<div style={{ height: "70vh", minHeight: 400, background: "linear-gradient(135deg, #1a0a0a, #0a0a0a)", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="skeleton" style={{ width: 300, height: 48 }} /></div>}>
        <HeroSection />
      </Suspense>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>

        {/* ── TRENDING MOVIES ── */}
        <section style={{ paddingTop: "3rem", paddingBottom: "3rem" }} aria-label="Trending movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🎬" title={<>Trending <span className="gradient-text">Movies</span></>} href="/movies" linkLabel="See All" />
          <Suspense fallback={<SkeletonPosterRow />}><TrendingMoviesRow /></Suspense>
        </section>

        {/* ── TRENDING SHOWS ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Trending TV shows">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="📺" title={<>Trending <span className="gradient-text-blue">Shows</span></>} href="/tv-shows" linkLabel="See All" linkColor="#0070f3" />
          <Suspense fallback={<SkeletonPosterRow />}><TrendingShowsRow /></Suspense>
        </section>

        {/* ── AD SLOT 1 ── */}
        <div className="ad-slot" style={{ height: 90, margin: "0 0 3rem" }}>Advertisement</div>

        {/* ── NOW IN CINEMAS ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Now in cinemas">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🎭" title="Now in Cinemas" href="/movies" linkLabel="See All" />
          <Suspense fallback={<SkeletonPosterRow />}><NowPlayingRow /></Suspense>
        </section>

        {/* ── UPCOMING MOVIES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Upcoming movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🗓️" title={<>Coming <span className="gradient-text">Soon</span></>} href="/movies" linkLabel="See All" />
          <Suspense fallback={<SkeletonPosterRow />}><UpcomingMoviesRow /></Suspense>
        </section>

        {/* ── BOLLYWOOD ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Bollywood movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🇮🇳" title={<>Bollywood <span className="gradient-text-gold">Hindi</span></>} href="/movies" linkLabel="See All" linkColor="#f5c518" />
          <Suspense fallback={<SkeletonPosterRow />}><BollywoodRow /></Suspense>
        </section>

        {/* ── URDU / SOUTH ASIAN DRAMAS ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Urdu and South Asian dramas">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🇵🇰" title={<>Pakistani & <span className="gradient-text-green">Urdu</span> Dramas</>} href="/tv-shows" linkLabel="See All" linkColor="#00b341" />
          <Suspense fallback={<SkeletonPosterRow />}><UrduDramasRow /></Suspense>
        </section>

        {/* ── ACTION MOVIES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Action movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="💥" title="Action Movies" href="/movies?genre=28" linkLabel="See All" />
          <Suspense fallback={<SkeletonPosterRow />}><ActionMoviesRow /></Suspense>
        </section>

        {/* ── COMEDY ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Comedy movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="😂" title="Comedy Movies" href="/movies?genre=35" linkLabel="See All" />
          <Suspense fallback={<SkeletonPosterRow />}><ComedyMoviesRow /></Suspense>
        </section>

        {/* ── AD SLOT 2 ── */}
        <div className="ad-slot" style={{ height: 90, margin: "0 0 3rem" }}>Advertisement</div>

        {/* ── HORROR & THRILLER ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Horror movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="👻" title="Horror & Thriller" href="/movies?genre=27" linkLabel="See All" />
          <Suspense fallback={<SkeletonPosterRow />}><HorrorMoviesRow /></Suspense>
        </section>

        {/* ── ANIME ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Anime shows">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🗾" title={<>Anime <span className="gradient-text-blue">Series</span></>} href="/tv-shows" linkLabel="See All" linkColor="#0070f3" />
          <Suspense fallback={<SkeletonPosterRow />}><AnimeRow /></Suspense>
        </section>

        {/* ── TOP RATED MOVIES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Top rated movies">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🏆" title={<>Top Rated <span className="gradient-text-gold">Movies</span></>} href="/movies" linkLabel="See All" linkColor="#f5c518" />
          <Suspense fallback={<SkeletonPosterRow />}><TopRatedMoviesRow /></Suspense>
        </section>

        {/* ── TOP RATED SHOWS ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Top rated TV shows">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="⭐" title={<>Top Rated <span className="gradient-text-blue">TV Shows</span></>} href="/tv-shows" linkLabel="See All" linkColor="#0070f3" />
          <Suspense fallback={<SkeletonPosterRow />}><TopRatedShowsRow /></Suspense>
        </section>

        {/* ── AD SLOT 3 ── */}
        <div className="ad-slot" style={{ height: 90, margin: "0 0 3rem" }}>Advertisement</div>

        {/* ── CRICKET SCORES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Cricket scores">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="🏏" title={<><span className="gradient-text-green">Cricket</span> Scores</>} href="/cricket" linkLabel="All Matches" linkColor="#00b341" />
          <Suspense fallback={<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 12 }} />)}</div>}>
            <CricketSection />
          </Suspense>
        </section>

        {/* ── FOOTBALL SCORES ── */}
        <section style={{ paddingBottom: "3rem" }} aria-label="Football scores">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="⚽" title={<><span className="gradient-text-blue">Football</span> Scores</>} href="/football" linkLabel="All Matches" linkColor="#0070f3" />
          <Suspense fallback={<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}</div>}>
            <FootballSection />
          </Suspense>
        </section>

        {/* ── LATEST NEWS ── */}
        <section style={{ paddingBottom: "4rem" }} aria-label="Sports news">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <SectionHeader emoji="📰" title={<>Latest <span className="gradient-text">Sports News</span></>} href="/cricket" linkLabel="More" />
          <Suspense fallback={<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}</div>}>
            <NewsSection />
          </Suspense>
        </section>

        {/* ── AD SLOT 4 ── */}
        <div className="ad-slot" style={{ height: 90, margin: "0 0 3rem" }}>Advertisement</div>

      </div>
    </>
  );
}
