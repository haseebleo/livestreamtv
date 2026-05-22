import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  getTrendingMovies, getNowPlayingMovies, getTopRatedMovies,
  getBollywoodMovies, getTurkishDramas, getKoreanDramas,
  getMoviesByGenre, POSTER, BACKDROP,
} from "@/lib/api/tmdb";
import { DRAMAS } from "@/lib/api/dramas";
import { getCurrentMatches, getMatchStatus, formatScore } from "@/lib/api/cricket";
import { getAllFootballMatches, type ESPNMatch } from "@/lib/api/espn";
import { JsonLd } from "@/components/seo/json-ld";
import { ContentCard, ContentCardSkeleton } from "@/components/ui/content-card";
import { HeroSlider, type HeroSlide } from "@/components/ui/hero-slider";
import { ContinueWatching } from "@/components/ui/continue-watching";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "LiveStreamTV.pk — Watch Movies, Dramas & Live TV Online Free",
  description:
    "Watch Pakistani dramas, Bollywood movies, Turkish & Korean series, and live sports online free. Pakistan's #1 streaming site.",
  openGraph: {
    title: "LiveStreamTV.pk — Watch Free Online",
    description: "Pakistani dramas, Bollywood, Turkish dramas, Korean series and live sports — all free.",
    type: "website",
    url: "https://livestreamtv.pk",
    images: [{ url: "https://livestreamtv.pk/og-image.jpg", width: 1200, height: 630 }],
  },
};

// ── HERO ────────────────────────────────────────────────────────────────────

async function HeroSection() {
  const movies = await getTrendingMovies();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slides: HeroSlide[] = movies.slice(0, 6).map((m: any) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    backdropUrl: BACKDROP(m.backdrop_path),
    posterUrl: POSTER(m.poster_path),
    year: m.release_date ? new Date(m.release_date).getFullYear() : undefined,
    rating: m.vote_average,
    genres: m.genre_ids?.slice(0, 4).map(() => ""),   // genres not available from trending endpoint
    quality: "HD",
    watchHref: `/watch/movie/${m.id}`,
    infoHref: `/movies/${m.id}`,
  }));
  return <HeroSlider slides={slides} />;
}

// ── ROW COMPONENTS ───────────────────────────────────────────────────────────

async function LatestMoviesRow() {
  const movies = await getTrendingMovies();
  return (
    <div className="content-grid">
      {movies.slice(0, 12).map((m: { id: number; title: string; poster_path: string | null; release_date?: string; vote_average?: number }) => (
        <ContentCard
          key={m.id}
          title={m.title}
          posterUrl={POSTER(m.poster_path)}
          href={`/watch/movie/${m.id}`}
          year={m.release_date ? new Date(m.release_date).getFullYear() : undefined}
          rating={m.vote_average}
        />
      ))}
    </div>
  );
}

async function NowPlayingRow() {
  const movies = await getNowPlayingMovies();
  return (
    <div className="content-grid">
      {movies.slice(0, 12).map((m: { id: number; title: string; poster_path: string | null; release_date?: string; vote_average?: number }) => (
        <ContentCard
          key={m.id}
          title={m.title}
          posterUrl={POSTER(m.poster_path)}
          href={`/watch/movie/${m.id}`}
          year={m.release_date ? new Date(m.release_date).getFullYear() : undefined}
          rating={m.vote_average}
        />
      ))}
    </div>
  );
}

async function BollywoodRow() {
  const movies = await getBollywoodMovies();
  return (
    <div className="content-grid">
      {movies.slice(0, 12).map((m: { id: number; title: string; poster_path: string | null; release_date?: string; vote_average?: number }) => (
        <ContentCard
          key={m.id}
          title={m.title}
          posterUrl={POSTER(m.poster_path)}
          href={`/watch/movie/${m.id}`}
          year={m.release_date ? new Date(m.release_date).getFullYear() : undefined}
          rating={m.vote_average}
        />
      ))}
    </div>
  );
}

async function TurkishRow() {
  const { results } = await getTurkishDramas();
  return (
    <div className="content-grid">
      {results.slice(0, 12).map((s: { id: number; name: string; poster_path: string | null; first_air_date?: string; vote_average?: number }) => (
        <ContentCard
          key={s.id}
          title={s.name}
          posterUrl={POSTER(s.poster_path)}
          href={`/watch/movie/${s.id}`}
          year={s.first_air_date ? new Date(s.first_air_date).getFullYear() : undefined}
          rating={s.vote_average}
        />
      ))}
    </div>
  );
}

async function KoreanRow() {
  const { results } = await getKoreanDramas();
  return (
    <div className="content-grid">
      {results.slice(0, 12).map((s: { id: number; name: string; poster_path: string | null; first_air_date?: string; vote_average?: number }) => (
        <ContentCard
          key={s.id}
          title={s.name}
          posterUrl={POSTER(s.poster_path)}
          href={`/watch/movie/${s.id}`}
          year={s.first_air_date ? new Date(s.first_air_date).getFullYear() : undefined}
          rating={s.vote_average}
        />
      ))}
    </div>
  );
}

async function ActionRow() {
  const movies = await getMoviesByGenre(28);
  return (
    <div className="content-grid">
      {movies.slice(0, 12).map((m: { id: number; title: string; poster_path: string | null; release_date?: string; vote_average?: number }) => (
        <ContentCard
          key={m.id}
          title={m.title}
          posterUrl={POSTER(m.poster_path)}
          href={`/watch/movie/${m.id}`}
          year={m.release_date ? new Date(m.release_date).getFullYear() : undefined}
          rating={m.vote_average}
        />
      ))}
    </div>
  );
}

async function TopRatedRow() {
  const movies = await getTopRatedMovies();
  return (
    <div className="content-grid">
      {movies.slice(0, 12).map((m: { id: number; title: string; poster_path: string | null; release_date?: string; vote_average?: number }) => (
        <ContentCard
          key={m.id}
          title={m.title}
          posterUrl={POSTER(m.poster_path)}
          href={`/watch/movie/${m.id}`}
          year={m.release_date ? new Date(m.release_date).getFullYear() : undefined}
          rating={m.vote_average}
        />
      ))}
    </div>
  );
}

// Pakistani dramas from local catalogue
function PakistaniDramasRow() {
  const ongoing   = DRAMAS.filter((d) => d.status === "ongoing").slice(0, 6);
  const completed = DRAMAS.filter((d) => d.status === "completed").slice(0, 6);
  const dramas    = [...ongoing, ...completed].slice(0, 12);
  return (
    <div className="content-grid">
      {dramas.map((d) => (
        <ContentCard
          key={d.slug}
          title={d.title}
          posterUrl={d.thumbnail}
          href={`/watch/drama/${d.slug}/episode/1`}
          year={d.year}
          badge={d.status === "ongoing" ? "LIVE" : undefined}
          quality="HD"
        />
      ))}
    </div>
  );
}

// ── SKELETONS ────────────────────────────────────────────────────────────────

function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="content-grid">
      {Array.from({ length: count }).map((_, i) => <ContentCardSkeleton key={i} />)}
    </div>
  );
}

// ── SECTION WRAPPER ──────────────────────────────────────────────────────────

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div className="stream-section-header">
        <h2 className="stream-section-title">{title}</h2>
        {href && <Link href={href} className="stream-see-all">See All →</Link>}
      </div>
      {children}
    </section>
  );
}

// ── CRICKET MINI ─────────────────────────────────────────────────────────────

async function CricketMini() {
  const matches = await getCurrentMatches();
  const live    = matches.filter((m) => getMatchStatus(m) === "live");
  const show    = live.length > 0 ? live.slice(0, 3) : matches.slice(0, 3);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
      {show.map((match) => {
        const t1 = match.teams[0] ?? "Team A";
        const t2 = match.teams[1] ?? "Team B";
        const s1 = formatScore(match, t1);
        const s2 = formatScore(match, t2);
        const isLive = getMatchStatus(match) === "live";
        return (
          <Link key={match.id} href="/cricket" style={{ display: "block", background: "#141422", border: `1px solid ${isLive ? "rgba(229,9,20,0.3)" : "#1e1e2e"}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{match.name}</span>
              {isLive && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.06em" }}>
                  <span className="live-dot" style={{ width: 5, height: 5, background: "#e50914", borderRadius: "50%", display: "inline-block" }} /> LIVE
                </span>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t1}</p>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#6b7280" }}>VS</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "right" }}>{t2}</p>
            </div>
            {s1 !== "-" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
                <p style={{ fontSize: 15, fontWeight: 900, color: "#00b341" }}>{s1}</p>
                <p style={{ fontSize: 15, fontWeight: 900, color: "#b3b3b3", textAlign: "right" }}>{s2}</p>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}

async function FootballMini() {
  const all  = await getAllFootballMatches();
  const live = all.filter((m: ESPNMatch) => m.status === "live").slice(0, 3);
  const show = live.length > 0 ? live : all.slice(0, 3);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
      {show.map((match: ESPNMatch) => {
        const isLive = match.status === "live";
        return (
          <Link key={match.id} href="/football" style={{ display: "block", background: "#141422", border: `1px solid ${isLive ? "rgba(229,9,20,0.3)" : "#1e1e2e"}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "#f5c518", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{match.leagueFlag} {match.league}</span>
              {isLive && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.06em" }}>
                  <span className="live-dot" style={{ width: 5, height: 5, background: "#e50914", borderRadius: "50%", display: "inline-block" }} /> LIVE
                </span>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{match.homeTeam}</p>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "5px 10px" }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                  {match.status === "upcoming" ? "–" : `${match.homeScore ?? 0}–${match.awayScore ?? 0}`}
                </span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "right" }}>{match.awayTeam}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default async function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LiveStreamTV.pk",
    url: "https://livestreamtv.pk",
    description: "Watch movies, dramas, and live sports online free in Pakistan",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://livestreamtv.pk/search?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      {/* HERO */}
      <Suspense fallback={<div style={{ height: "72vh", minHeight: 440, background: "#080810" }} />}>
        <HeroSection />
      </Suspense>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 1rem 5rem" }}>

        {/* Continue Watching (client, localStorage) */}
        <ContinueWatching />

        {/* Latest Movies */}
        <Section title="Latest Movies" href="/movies">
          <Suspense fallback={<GridSkeleton />}><LatestMoviesRow /></Suspense>
        </Section>

        {/* Pakistani Dramas */}
        <Section title="Pakistani Dramas" href="/dramas">
          <PakistaniDramasRow />
        </Section>

        {/* Ad slot */}
        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* Now Playing */}
        <Section title="Now in Cinemas" href="/movies">
          <Suspense fallback={<GridSkeleton />}><NowPlayingRow /></Suspense>
        </Section>

        {/* Bollywood */}
        <Section title="Bollywood Movies" href="/bollywood">
          <Suspense fallback={<GridSkeleton />}><BollywoodRow /></Suspense>
        </Section>

        {/* Turkish */}
        <Section title="Turkish Dramas" href="/turkish-dramas">
          <Suspense fallback={<GridSkeleton />}><TurkishRow /></Suspense>
        </Section>

        {/* Korean */}
        <Section title="Korean Dramas" href="/korean-dramas">
          <Suspense fallback={<GridSkeleton />}><KoreanRow /></Suspense>
        </Section>

        {/* Ad slot */}
        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* Action Movies */}
        <Section title="Action Movies" href="/movies?genre=28">
          <Suspense fallback={<GridSkeleton />}><ActionRow /></Suspense>
        </Section>

        {/* Top Rated */}
        <Section title="Top Rated Movies" href="/movies">
          <Suspense fallback={<GridSkeleton />}><TopRatedRow /></Suspense>
        </Section>

        {/* Ad slot */}
        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* Cricket */}
        <Section title="Live Cricket Scores" href="/cricket">
          <Suspense fallback={<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 10 }} />)}</div>}>
            <CricketMini />
          </Suspense>
        </Section>

        {/* Football */}
        <Section title="Football Scores" href="/football">
          <Suspense fallback={<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 10 }} />)}</div>}>
            <FootballMini />
          </Suspense>
        </Section>

      </div>
    </>
  );
}
