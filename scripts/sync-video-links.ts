/**
 * Daily sync: auto-populates VideoLink table with embed URLs for movies & TV shows.
 * Uses TMDB to discover popular/trending content, then inserts links from
 * multiple free embed providers (vidsrc.to, vidsrc.me, 2embed.cc, embed.su).
 *
 * Run:   npx tsx scripts/sync-video-links.ts
 * Cron:  set up via PM2 ecosystem or server crontab (see README)
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const TMDB_KEY = process.env.TMDB_API_KEY ?? "126ec8210dd7257e8bc3d34bd254a182";
const TMDB_BASE = "https://api.themoviedb.org/3";

// ── Embed server templates ────────────────────────────────────────────────────

const MOVIE_SERVERS = [
  { name: "Server 1", url: (id: number) => `https://vidsrc.to/embed/movie/${id}` },
  { name: "Server 2", url: (id: number) => `https://vidsrc.me/embed/movie?tmdb=${id}` },
  { name: "Server 3", url: (id: number) => `https://www.2embed.cc/embed/${id}` },
  { name: "Server 4", url: (id: number) => `https://embed.su/embed/movie/${id}` },
];

const SHOW_SERVERS = [
  { name: "Server 1", url: (id: number, s: number, e: number) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { name: "Server 2", url: (id: number, s: number, e: number) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}` },
  { name: "Server 3", url: (id: number, s: number, e: number) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
  { name: "Server 4", url: (id: number, s: number, e: number) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
];

// ── TMDB helper ───────────────────────────────────────────────────────────────

async function tmdbGet(path: string, extra = "") {
  const url = `${TMDB_BASE}${path}?api_key=${TMDB_KEY}&language=en-US${extra}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${path} → ${res.status}`);
  return res.json() as Promise<any>;
}

// ── Movie sync ────────────────────────────────────────────────────────────────

async function syncMovies() {
  const endpoints = [
    "/movie/popular",
    "/movie/now_playing",
    "/movie/top_rated",
    "/trending/movie/week",
  ];

  let added = 0;
  const seen = new Set<number>();

  for (const ep of endpoints) {
    for (let page = 1; page <= 5; page++) {
      let results: any[];
      try {
        const data = await tmdbGet(ep, `&page=${page}`);
        results = data.results ?? [];
      } catch (e) {
        console.error(`  [skip] ${ep} page ${page}:`, e);
        continue;
      }

      for (const movie of results) {
        if (seen.has(movie.id)) continue;
        seen.add(movie.id);

        const contentId = String(movie.id);
        const exists = await db.videoLink.count({ where: { contentId, contentType: "movie" } });
        if (exists > 0) continue;

        await db.videoLink.createMany({
          data: MOVIE_SERVERS.map((srv, i) => ({
            id: `auto_m_${movie.id}_${i}`,
            contentId,
            contentType: "movie",
            episode: 0,
            serverName: srv.name,
            embedUrl: srv.url(movie.id),
            quality: "HD",
            lang: "Multi",
            sortOrder: i,
            updatedAt: new Date(),
          })),
          skipDuplicates: true,
        });
        added++;
      }
    }
  }

  console.log(`  Movies: +${added} new (${seen.size} discovered)`);
}

// ── TV Show sync ──────────────────────────────────────────────────────────────

async function syncShows() {
  const endpoints = [
    "/tv/popular",
    "/tv/top_rated",
    "/trending/tv/week",
  ];

  let addedShows = 0;
  let addedEpisodes = 0;
  const seen = new Set<number>();

  for (const ep of endpoints) {
    for (let page = 1; page <= 3; page++) {
      let results: any[];
      try {
        const data = await tmdbGet(ep, `&page=${page}`);
        results = data.results ?? [];
      } catch (e) {
        console.error(`  [skip] ${ep} page ${page}:`, e);
        continue;
      }

      for (const show of results) {
        if (seen.has(show.id)) continue;
        seen.add(show.id);

        // Check if show already has any links
        const existingShow = await db.videoLink.count({
          where: { contentId: String(show.id), contentType: "show" },
        });
        if (existingShow > 0) continue;

        // Fetch show details to get season/episode counts
        let details: any;
        try {
          details = await tmdbGet(`/tv/${show.id}`);
        } catch {
          continue;
        }

        const seasons: any[] = (details.seasons ?? []).filter(
          (s: any) => s.season_number > 0 && s.episode_count > 0
        );

        for (const season of seasons) {
          const s = season.season_number;
          const epCount = Math.min(season.episode_count, 50); // cap per season

          for (let e = 1; e <= epCount; e++) {
            await db.videoLink.createMany({
              data: SHOW_SERVERS.map((srv, i) => ({
                id: `auto_tv_${show.id}_s${s}e${e}_${i}`,
                contentId: String(show.id),
                contentType: "show",
                season: s,
                episode: e,
                serverName: srv.name,
                embedUrl: srv.url(show.id, s, e),
                quality: "HD",
                lang: "Multi",
                sortOrder: i,
                updatedAt: new Date(),
              })),
              skipDuplicates: true,
            });
            addedEpisodes++;
          }
        }
        addedShows++;
      }
    }
  }

  console.log(`  Shows: +${addedShows} new shows, +${addedEpisodes} episode links`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const start = Date.now();
  console.log(`\n[${new Date().toISOString()}] Daily video-link sync starting...`);

  try {
    await syncMovies();
    await syncShows();
  } catch (e) {
    console.error("Sync failed:", e);
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`Done in ${elapsed}s\n`);
  }
}

main();
