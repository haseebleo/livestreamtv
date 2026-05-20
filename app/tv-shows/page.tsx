import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTrendingShows, getPopularShows, POSTER } from "@/lib/api/tmdb";
import { JsonLd } from "@/components/seo/json-ld";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Best TV Shows to Stream Online",
  description:
    "Find the best TV shows streaming on Netflix, HBO Max, Disney+, Amazon Prime and more. Trending series, top-rated dramas and must-watch shows updated daily.",
  openGraph: {
    title: "Best TV Shows to Stream | LiveStreamTV.pk",
    description: "Top-rated and trending TV shows across Netflix, HBO Max, Disney+ and more.",
  },
};

const TV_GENRES = [
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 10759, name: "Action & Adventure" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 10765, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
];

export default async function TvShowsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const [trending, popular] = await Promise.all([
    getTrendingShows(),
    getPopularShows(page),
  ]);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://livestreamtv.pk" },
      { "@type": "ListItem", position: 2, name: "TV Shows", item: "https://livestreamtv.pk/tv-shows" },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div style={{ minHeight: "100vh", paddingTop: 80 }}>

        {/* ── HEADER ── */}
        <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
          <div
            style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,112,243,0.1) 0%, transparent 70%)", pointerEvents: "none" }}
            aria-hidden="true"
          />
          <div style={{ position: "relative" }}>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#ffffff", marginBottom: 12 }}>
              Best <span className="gradient-text-blue">TV Shows</span> to Stream
            </h1>
            <p style={{ color: "#b3b3b3", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Top-rated series across Netflix, HBO Max, Disney+, Amazon Prime and more
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem 5rem" }}>

          {/* ── GENRE PILLS ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {TV_GENRES.map((g) => (
              <span
                key={g.id}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid #2a2a2a",
                  color: "#b3b3b3",
                  cursor: "default",
                }}
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* ── AD SLOT ── */}
          <div className="ad-slot" style={{ height: 90, marginBottom: 24 }}>Advertisement</div>

          {/* ── TRENDING SECTION ── */}
          {page === 1 && trending.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff" }}>
                  🔥 Trending This Week
                </h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 16,
                }}
              >
                {trending.slice(0, 6).map((show: {
                  id: number;
                  name: string;
                  poster_path: string | null;
                  vote_average: number;
                  first_air_date: string;
                }) => {
                  const poster = POSTER(show.poster_path);
                  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear().toString() : "";
                  return (
                    <Link key={show.id} href={`/tv-shows/${show.id}`} style={{ textDecoration: "none" }} aria-label={show.name}>
                      <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", marginBottom: 8, transition: "transform 0.2s" }} className="card-hover">
                        {poster ? (
                          <Image src={poster} alt={show.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 50vw, 150px" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: `linear-gradient(135deg, hsl(${(show.id * 53) % 360} 30% 15%), hsl(${(show.id * 79) % 360} 30% 10%))` }}>
                            <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">📺</span>
                            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{show.name}</span>
                          </div>
                        )}
                        <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                          <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{show.vote_average.toFixed(1)}</span>
                        </div>
                        {/* Trending badge */}
                        <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(229,9,20,0.9)", borderRadius: 3, padding: "1px 5px" }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>🔥 TRENDING</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{show.name}</p>
                      {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── POPULAR SHOWS GRID ── */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff" }}>
                Popular TV Shows
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 16,
                marginBottom: 40,
              }}
            >
              {popular.map((show: {
                id: number;
                name: string;
                poster_path: string | null;
                vote_average: number;
                first_air_date: string;
              }) => {
                const poster = POSTER(show.poster_path);
                const year = show.first_air_date ? new Date(show.first_air_date).getFullYear().toString() : "";
                return (
                  <Link key={show.id} href={`/tv-shows/${show.id}`} style={{ textDecoration: "none" }} aria-label={show.name}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", marginBottom: 8 }} className="card-hover">
                      {poster ? (
                        <Image src={poster} alt={show.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 50vw, 150px" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: `linear-gradient(135deg, hsl(${(show.id * 53) % 360} 30% 15%), hsl(${(show.id * 79) % 360} 30% 10%))` }}>
                          <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">📺</span>
                          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{show.name}</span>
                        </div>
                      )}
                      <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                        <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{show.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{show.name}</p>
                    {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
              {page > 1 && (
                <Link href={`/tv-shows?page=${page - 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #2a2a2a", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  ← Previous
                </Link>
              )}
              {[page, page + 1, page + 2].filter((p) => p > 0).map((p) => (
                <Link key={p} href={`/tv-shows?page=${p}`} style={{ padding: "8px 14px", background: p === page ? "#0070f3" : "rgba(255,255,255,0.06)", border: p === page ? "1px solid #0070f3" : "1px solid #2a2a2a", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  {p}
                </Link>
              ))}
              <Link href={`/tv-shows?page=${page + 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #2a2a2a", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Next →
              </Link>
            </div>
          </section>

          {/* ── AD SLOT ── */}
          <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

          {/* ── CTA ── */}
          <div style={{ textAlign: "center" }}>
            <Link href="/movies" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a2a", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              🎬 Also check Movies Guide →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
