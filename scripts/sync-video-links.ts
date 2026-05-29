/**
 * Daily sync: auto-populates VideoLink table with embed URLs for movies, TV shows & dramas.
 * Provider-based, env-configured, with broken-link checking.
 *
 * Run full sync:   npx tsx scripts/sync-video-links.ts
 * Check only:      npx tsx scripts/sync-video-links.ts --check-only
 * Verbose mode:    npx tsx scripts/sync-video-links.ts --verbose
 */
import { db } from "@/lib/db";
import { getProviders, type VideoLinkProvider } from "@/lib/video-link-providers";
import { DRAMAS } from "@/lib/api/dramas";

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const CHECK_BATCH_SIZE = parseInt(process.env.BROKEN_CHECK_BATCH_SIZE ?? "100", 10);

const checkOnly = process.argv.includes("--check-only");
const verbose = process.argv.includes("--verbose");

async function tmdbGet(path: string, extra = "") {
  if (!TMDB_KEY) throw new Error("TMDB_API_KEY not set");
  const url = `${TMDB_BASE}${path}?api_key=${TMDB_KEY}&language=en-US${extra}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${path} → ${res.status}`);
  return res.json() as Promise<any>;
}

async function upsertLinks(
  contentId: string,
  contentType: string,
  season: number,
  episode: number,
  provider: VideoLinkProvider,
  links: Array<{ serverName: string; embedUrl: string; quality: string; lang: string }>
) {
  if (links.length === 0) return 0;

  // Dedupe against any existing link (any provider, any source)
  const existing = await db.videoLink.findMany({
    where: { contentId, contentType, season, episode },
    select: { embedUrl: true },
  });
  const seenUrls = new Set(existing.map((l) => l.embedUrl));

  const newLinks = links
    .filter((l) => !seenUrls.has(l.embedUrl))
    .map((l, i) => ({
      id: `auto_${provider.name}_${contentType}_${contentId}_s${season}e${episode}_${i}`,
      contentId,
      contentType,
      season,
      episode,
      serverName: l.serverName,
      embedUrl: l.embedUrl,
      quality: l.quality,
      lang: l.lang,
      sortOrder: i,
      provider: provider.name,
      updatedAt: new Date(),
    }));

  if (newLinks.length === 0) return 0;
  const result = await db.videoLink.createMany({ data: newLinks, skipDuplicates: true });
  return result.count;
}

async function syncMovies(providers: VideoLinkProvider[]) {
  const movieProviders = providers.filter((p) => p.supports("movie"));
  if (movieProviders.length === 0) {
    console.log("  [movies] No providers enabled, skipping.");
    return;
  }
  const endpoints = ["/movie/popular", "/movie/now_playing", "/movie/top_rated", "/trending/movie/week"];
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
        for (const provider of movieProviders) {
          const existing = await db.videoLink.count({
            where: { contentId, contentType: "movie", provider: provider.name },
          });
          if (existing > 0) continue;
          const links = await provider.generateLinks({ contentId, contentType: "movie", tmdbId: movie.id });
          const count = await upsertLinks(contentId, "movie", 1, 0, provider, links);
          added += count;
          if (verbose && count > 0) {
            console.log(`  [movies] +${count} from ${provider.name} for ${movie.title} (${movie.id})`);
          }
        }
      }
    }
  }
  console.log(`  Movies: +${added} new links (${seen.size} discovered)`);
}

async function syncShows(providers: VideoLinkProvider[]) {
  const showProviders = providers.filter((p) => p.supports("show"));
  if (showProviders.length === 0) {
    console.log("  [shows] No providers enabled, skipping.");
    return;
  }
  const endpoints = ["/tv/popular", "/tv/top_rated", "/trending/tv/week"];
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
          const epCount = Math.min(season.episode_count, 50);
          for (let e = 1; e <= epCount; e++) {
            for (const provider of showProviders) {
              const existing = await db.videoLink.count({
                where: {
                  contentId: String(show.id),
                  contentType: "show",
                  season: s,
                  episode: e,
                  provider: provider.name,
                },
              });
              if (existing > 0) continue;
              const links = await provider.generateLinks({
                contentId: String(show.id),
                contentType: "show",
                tmdbId: show.id,
                season: s,
                episode: e,
              });
              const count = await upsertLinks(String(show.id), "show", s, e, provider, links);
              addedEpisodes += count;
            }
          }
        }
        addedShows++;
      }
    }
  }
  console.log(`  Shows: +${addedShows} new shows, +${addedEpisodes} episode links`);
}

async function syncDramas(providers: VideoLinkProvider[]) {
  const dramaProviders = providers.filter((p) => p.supports("drama"));
  if (dramaProviders.length === 0) {
    console.log("  [dramas] No providers enabled, skipping.");
    return;
  }
  let added = 0;
  for (const drama of DRAMAS) {
    const total = drama.totalEpisodes ?? 0;
    if (total === 0) continue;
    for (let e = 1; e <= total; e++) {
      for (const provider of dramaProviders) {
        const existing = await db.videoLink.count({
          where: { contentId: drama.slug, contentType: "drama", episode: e, provider: provider.name },
        });
        if (existing > 0) continue;
        const links = await provider.generateLinks({
          contentId: drama.slug,
          contentType: "drama",
          episode: e,
          ytPlaylistId: drama.ytPlaylistId,
        });
        const count = await upsertLinks(drama.slug, "drama", 1, e, provider, links);
        added += count;
        if (verbose && count > 0) {
          console.log(`  [dramas] +${count} from ${provider.name} for ${drama.slug} ep ${e}`);
        }
      }
    }
  }
  console.log(`  Dramas: +${added} new episode links`);
}

async function checkBrokenLinks(providers: VideoLinkProvider[]) {
  console.log("  [check] Starting broken-link check...");
  const batch = await db.videoLink.findMany({
    where: { provider: { not: "manual" } },
    orderBy: { updatedAt: "asc" },
    take: CHECK_BATCH_SIZE,
  });
  let checked = 0;
  let broken = 0;
  let reactivated = 0;

  for (const link of batch) {
    const provider = providers.find((p) => p.name === link.provider);
    if (!provider) {
      console.warn(`  [check] Unknown provider "${link.provider}" for ${link.id}, skipping.`);
      continue;
    }
    const result = await provider.checkLink(link.embedUrl);
    checked++;
    if (!result.ok) {
      if (link.isActive) {
        await db.videoLink.update({
          where: { id: link.id },
          data: { isActive: false, updatedAt: new Date() },
        });
        broken++;
      } else {
        await db.videoLink.update({
          where: { id: link.id },
          data: { updatedAt: new Date() },
        });
      }
      console.log(
        `  [broken] ${link.provider} ${link.contentType} ${link.contentId} s${link.season}e${link.episode} → ${result.status ?? result.error}`
      );
    } else {
      if (!link.isActive) {
        await db.videoLink.update({
          where: { id: link.id },
          data: { isActive: true, updatedAt: new Date() },
        });
        reactivated++;
      } else {
        await db.videoLink.update({
          where: { id: link.id },
          data: { updatedAt: new Date() },
        });
      }
    }
  }
  console.log(`  [check] ${checked} checked, ${broken} marked broken, ${reactivated} reactivated`);
}

async function main() {
  const start = Date.now();
  console.log(`\n[${new Date().toISOString()}] Video-link sync starting...`);
  const providers = getProviders();
  console.log(`  Providers: ${providers.map((p) => p.name).join(", ") || "none"}`);

  if (!TMDB_KEY) {
    console.warn("  Warning: TMDB_API_KEY is not set. Movie/TV sync will be skipped.");
  }

  try {
    if (!checkOnly) {
      if (TMDB_KEY) {
        await syncMovies(providers);
        await syncShows(providers);
      }
      await syncDramas(providers);
    } else {
      console.log("  --check-only mode: skipping sync, checking broken links only.");
    }
    await checkBrokenLinks(providers);
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
