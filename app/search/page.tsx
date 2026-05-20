import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { searchMulti, POSTER } from "@/lib/api/tmdb";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  if (!q) {
    return {
      title: "Search Movies & TV Shows",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `Search: "${q}" — Movies & TV Shows`,
    description: `Search results for "${q}" — find where to watch on Netflix, Disney+, HBO Max and more.`,
    robots: { index: false, follow: true },
  };
}

const popularSearches = [
  "Avengers", "Batman", "Game of Thrones", "Breaking Bad",
  "The Last of Us", "Stranger Things", "Dune", "Oppenheimer",
  "Barbie", "Spider-Man", "House of Dragon", "Peaky Blinders",
];

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results: any[] = [];
  if (q) {
    results = await searchMulti(q);
  }

  const movies = results.filter((r) => r.media_type === "movie");
  const shows = results.filter((r) => r.media_type === "tv");
  const people = results.filter((r) => r.media_type === "person");
  const hasResults = results.length > 0;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1rem 5rem" }}>

        {/* ── SEARCH HEADER ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "#ffffff", marginBottom: 8 }}>
            {q ? (
              <>Search results for <span className="gradient-text">&ldquo;{q}&rdquo;</span></>
            ) : (
              <>Search <span className="gradient-text">Movies & Shows</span></>
            )}
          </h1>
          {q && (
            <p style={{ color: "#b3b3b3", fontSize: 14 }}>
              {hasResults ? `${results.length} result${results.length !== 1 ? "s" : ""} found` : "No results found"}
            </p>
          )}
        </div>

        {/* ── SEARCH BOX ── */}
        <form action="/search" method="GET" style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              background: "#1c1c1c",
              border: "2px solid #2a2a2a",
              borderRadius: 10,
              overflow: "hidden",
              maxWidth: 600,
              transition: "border-color 0.2s",
            }}
          >
            <span style={{ padding: "12px 16px", fontSize: 18, flexShrink: 0 }} aria-hidden="true">🔍</span>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search movies, TV shows..."
              autoFocus={!q}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#ffffff",
                fontSize: 15,
                padding: "12px 0",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 20px",
                background: "#e50914",
                border: "none",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* ── NO QUERY STATE ── */}
        {!q && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#b3b3b3", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Popular Searches
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {popularSearches.map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  style={{
                    padding: "8px 16px",
                    background: "#1c1c1c",
                    border: "1px solid #2a2a2a",
                    borderRadius: 999,
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  🔍 {s}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── NO RESULTS ── */}
        {q && !hasResults && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: 56, marginBottom: 16 }} aria-hidden="true">😕</p>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 8 }}>No results found</h2>
            <p style={{ color: "#b3b3b3", fontSize: 14, marginBottom: 24 }}>
              Try different keywords or check the spelling
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {popularSearches.slice(0, 6).map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  style={{ padding: "6px 14px", background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 999, color: "#ffffff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {hasResults && (
          <>
            {/* Movies */}
            {movies.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 20 }}>
                  🎬 Movies <span style={{ color: "#6b7280", fontSize: 14, fontWeight: 400 }}>({movies.length})</span>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
                  {movies.map((movie) => {
                    const poster = POSTER(movie.poster_path);
                    const year = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : "";
                    return (
                      <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: "none" }} aria-label={movie.title}>
                        <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", borderRadius: 10, overflow: "hidden", background: "#1c1c1c", border: "1px solid #2a2a2a", marginBottom: 8 }} className="card-hover">
                          {poster ? (
                            <Image src={poster} alt={movie.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 50vw, 150px" />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", background: `linear-gradient(135deg, hsl(${(movie.id * 47) % 360} 30% 15%), hsl(${(movie.id * 83) % 360} 30% 10%))` }}>
                              <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">🎬</span>
                              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{movie.title}</span>
                            </div>
                          )}
                          {movie.vote_average > 0 && (
                            <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                              <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                              <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{movie.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{movie.title}</p>
                        {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TV Shows */}
            {shows.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 20 }}>
                  📺 TV Shows <span style={{ color: "#6b7280", fontSize: 14, fontWeight: 400 }}>({shows.length})</span>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
                  {shows.map((show) => {
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
                          {show.vote_average > 0 && (
                            <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                              <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
                              <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{show.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{show.name}</p>
                        {year && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* People (just a count note) */}
            {people.length > 0 && (
              <p style={{ fontSize: 13, color: "#6b7280" }}>
                + {people.length} person{people.length !== 1 ? "s" : ""} found in results
              </p>
            )}
          </>
        )}

      </div>
    </div>
  );
}
