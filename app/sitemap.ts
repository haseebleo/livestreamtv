import type { MetadataRoute } from "next";
import { getTrendingMovies, getTrendingShows } from "@/lib/api/tmdb";
import { DRAMAS } from "@/lib/api/dramas";

const BASE = "https://livestreamtv.pk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/cricket`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/football`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/movies`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/tv-shows`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/live-tv`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/dramas`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/tv-schedule`, lastModified: now, changeFrequency: "hourly", priority: 0.88 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "hourly", priority: 0.85 },
    { url: `${BASE}/standings`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/highlights`, lastModified: now, changeFrequency: "daily", priority: 0.75 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/dmca`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
  ];

  // TMDB content pages
  let moviePages: MetadataRoute.Sitemap = [];
  let showPages: MetadataRoute.Sitemap = [];

  try {
    const [movies, shows] = await Promise.all([
      getTrendingMovies(),
      getTrendingShows(),
    ]);

    moviePages = movies
      .slice(0, 20)
      .map((m: { id: number }) => ({
        url: `${BASE}/movies/${m.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    showPages = shows
      .slice(0, 20)
      .map((s: { id: number }) => ({
        url: `${BASE}/tv-shows/${s.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  } catch {
    // Fallback: hardcode 20 popular movie/show IDs if TMDB is unavailable
    const fallbackMovieIds = [
      299536, 299534, 284054, 315635, 399579, 429617, 597, 516486,
      454626, 400160, 634649, 338953, 19995, 475557, 603, 120, 76341,
      324857, 330457, 496243,
    ];
    const fallbackShowIds = [
      1396, 94997, 66732, 100088, 60625, 84958, 71912, 93405,
      209867, 135157, 90462, 85552, 76479, 63247, 62286, 87108,
      79744, 83867, 88396, 71914,
    ];

    moviePages = fallbackMovieIds.map((id) => ({
      url: `${BASE}/movies/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    showPages = fallbackShowIds.map((id) => ({
      url: `${BASE}/tv-shows/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  }

  // CMS pages from DB — try/catch in case DB is unavailable at build
  let cmsPages: MetadataRoute.Sitemap = [];
  try {
    const { db } = await import("@/lib/db");
    const pages = await db.page.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });
    cmsPages = pages.map((p) => ({
      url: `${BASE}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));
  } catch {
    // DB unavailable — skip CMS pages
  }

  // Drama pages — one per drama + one per episode
  const dramaPages: MetadataRoute.Sitemap = DRAMAS.map((d) => ({
    url: `${BASE}/dramas/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const episodePages: MetadataRoute.Sitemap = DRAMAS.flatMap((d) =>
    Array.from({ length: d.totalEpisodes ?? 0 }, (_, i) => ({
      url: `${BASE}/dramas/${d.slug}/episode/${i + 1}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...moviePages, ...showPages, ...dramaPages, ...episodePages, ...cmsPages];
}
