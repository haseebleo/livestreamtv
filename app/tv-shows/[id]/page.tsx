import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getShowDetails,
  getShowWatchProviders,
  getSimilarShows,
  getTrendingShows,
  POSTER,
  BACKDROP,
} from "@/lib/api/tmdb";
import { JsonLd } from "@/components/seo/json-ld";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getShowDetails(parseInt(id));
  if (!show) {
    return { title: "Show Not Found" };
  }
  const poster = POSTER(show.poster_path, "w500");
  return {
    title: `${show.name} — Where to Watch Online`,
    description: show.overview ?? `Find where to watch ${show.name} online.`,
    openGraph: {
      title: `${show.name} | LiveStreamTV.pk`,
      description: show.overview ?? "",
      images: poster ? [{ url: poster, width: 500, height: 750 }] : [],
    },
  };
}

export async function generateStaticParams() {
  const shows = await getTrendingShows();
  return shows.slice(0, 20).map((s: { id: number }) => ({ id: String(s.id) }));
}

export default async function ShowDetailPage({ params }: PageProps) {
  const { id } = await params;
  const showId = parseInt(id);
  const [show, providers, similar] = await Promise.all([
    getShowDetails(showId),
    getShowWatchProviders(showId),
    getSimilarShows(showId),
  ]);

  if (!show) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📺</p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Show Not Found</h1>
          <p style={{ color: "#b3b3b3", marginBottom: 24 }}>This TV show could not be loaded.</p>
          <Link href="/tv-shows" style={{ background: "#0070f3", color: "#fff", padding: "10px 24px", borderRadius: 6, fontWeight: 700, textDecoration: "none" }}>
            Browse TV Shows
          </Link>
        </div>
      </div>
    );
  }

  const backdrop = BACKDROP(show.backdrop_path);
  const poster = POSTER(show.poster_path, "w500");
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;
  const seasons = show.number_of_seasons;
  const episodes = show.number_of_episodes;
  const streamFlat: { provider_name: string; logo_path: string }[] = providers?.flatrate ?? [];
  const streamFree: { provider_name: string; logo_path: string }[] = providers?.free ?? [];
  const allProviders = [...streamFlat, ...streamFree];
  const cast: { id: number; name: string; character: string; profile_path: string | null }[] =
    show.credits?.cast?.slice(0, 15) ?? [];

  const showJsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.name,
    description: show.overview,
    image: poster,
    startDate: show.first_air_date,
    numberOfEpisodes: episodes,
    numberOfSeasons: seasons,
    aggregateRating: show.vote_average
      ? { "@type": "AggregateRating", ratingValue: show.vote_average.toFixed(1), ratingCount: show.vote_count ?? 1, bestRating: "10" }
      : undefined,
  };

  return (
    <>
      <JsonLd data={showJsonLd} />
      <div style={{ minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
          {backdrop ? (
            <Image src={backdrop} alt={show.name} fill priority style={{ objectFit: "cover", objectPosition: "center 20%" }} sizes="100vw" />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0a1a, #0a1a1a)" }} />
          )}
          <div className="hero-gradient" style={{ position: "absolute", inset: 0 }} aria-hidden="true" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, transparent 100%)" }} aria-hidden="true" />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>

          {/* ── DETAILS ── */}
          <div style={{ display: "flex", gap: 32, marginTop: -160, position: "relative", zIndex: 10, flexWrap: "wrap", padding: "0 0 3rem" }}>
            {/* Poster */}
            <div style={{ flexShrink: 0 }}>
              {poster ? (
                <Image src={poster} alt={show.name} width={200} height={300} style={{ borderRadius: 10, border: "2px solid #2a2a2a", display: "block" }} />
              ) : (
                <div style={{ width: 200, height: 300, borderRadius: 10, background: "#1c1c1c", border: "2px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }} aria-hidden="true">
                  📺
                </div>
              )}
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: 160 }}>
              {/* Genres */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {show.genres?.map((g: { id: number; name: string }) => (
                  <span
                    key={g.id}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: "rgba(0,112,243,0.12)",
                      border: "1px solid rgba(0,112,243,0.25)",
                      color: "#60a5fa",
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 900, color: "#fff", marginBottom: 8 }}>
                {show.name}
              </h1>

              {show.tagline && (
                <p style={{ fontSize: 14, color: "#b3b3b3", fontStyle: "italic", marginBottom: 12 }}>{show.tagline}</p>
              )}

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                {show.vote_average > 0 && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 15, fontWeight: 700 }}>
                    <span style={{ color: "#f5c518" }}>★</span>
                    <span style={{ color: "#fff" }}>{show.vote_average.toFixed(1)}</span>
                    <span style={{ color: "#6b7280", fontSize: 12 }}>/ 10</span>
                  </span>
                )}
                {year && <span style={{ color: "#b3b3b3", fontSize: 14 }}>{year}</span>}
                {seasons && <span style={{ color: "#b3b3b3", fontSize: 14 }}>{seasons} Season{seasons !== 1 ? "s" : ""}</span>}
                {episodes && <span style={{ color: "#b3b3b3", fontSize: 14 }}>{episodes} Episodes</span>}
              </div>

              {/* Status */}
              {show.status && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: show.status === "Returning Series" ? "rgba(0,179,65,0.12)" : "rgba(229,9,20,0.12)",
                    border: show.status === "Returning Series" ? "1px solid rgba(0,179,65,0.3)" : "1px solid rgba(229,9,20,0.3)",
                    color: show.status === "Returning Series" ? "#34d399" : "#f87171",
                  }}>
                    {show.status}
                  </span>
                </div>
              )}

              {/* Where to watch */}
              {allProviders.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Where to Watch
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {allProviders.map((p) => (
                      <div key={p.provider_name} title={p.provider_name} style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a2a", flexShrink: 0 }}>
                        <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              {show.overview && (
                <p style={{ fontSize: 14, color: "#b3b3b3", lineHeight: 1.7, maxWidth: 640 }}>
                  {show.overview}
                </p>
              )}
            </div>
          </div>

          {/* ── CAST ── */}
          {cast.length > 0 && (
            <section style={{ paddingBottom: "3rem" }}>
              <div className="section-divider" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 16 }}>Cast</h2>
              <div className="scroll-row">
                {cast.map((person) => {
                  const profileUrl = person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null;
                  return (
                    <div key={person.id} style={{ flexShrink: 0, width: 90, textAlign: "center" }}>
                      {profileUrl ? (
                        <Image src={profileUrl} alt={person.name} width={80} height={80} style={{ borderRadius: "50%", border: "2px solid #2a2a2a", margin: "0 auto 6px" }} />
                      ) : (
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#1c1c1c", border: "2px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: 28 }} aria-hidden="true">
                          👤
                        </div>
                      )}
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{person.name}</p>
                      <p style={{ fontSize: 10, color: "#6b7280", marginTop: 2, lineHeight: 1.3 }}>{person.character}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── AD SLOT ── */}
          <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

          {/* ── SIMILAR SHOWS ── */}
          {similar.length > 0 && (
            <section style={{ paddingBottom: "4rem" }}>
              <div className="section-divider" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 16 }}>More Like This</h2>
              <div className="scroll-row">
                {similar.map((s: {
                  id: number;
                  name: string;
                  poster_path: string | null;
                  vote_average: number;
                  first_air_date: string;
                }) => {
                  const p = POSTER(s.poster_path);
                  return (
                    <Link key={s.id} href={`/tv-shows/${s.id}`} className="poster-card" aria-label={s.name}>
                      <div style={{ width: 150, height: 225, borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", position: "relative" }}>
                        {p ? (
                          <Image src={p} alt={s.name} width={150} height={225} style={{ objectFit: "cover", width: "100%", height: "100%" }} sizes="150px" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: `linear-gradient(135deg, hsl(${(s.id * 53) % 360} 30% 15%), hsl(${(s.id * 79) % 360} 30% 10%))` }}>
                            <span style={{ fontSize: 28, marginBottom: 6 }} aria-hidden="true">📺</span>
                            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{s.name}</span>
                          </div>
                        )}
                        <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                          <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{s.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                      <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
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
