/**
 * Provider-based video-link generation.
 * Only imported by cron/scripts — do NOT import in client components.
 */

export interface LinkSpec {
  serverName: string;
  embedUrl: string;
  quality: string;
  lang: string;
}

export interface VideoLinkProvider {
  readonly name: string;
  supports(contentType: string): boolean;
  generateLinks(opts: {
    contentId: string;
    contentType: string;
    season?: number;
    episode?: number;
    tmdbId?: number;
    ytPlaylistId?: string;
  }): Promise<LinkSpec[]>;
  checkLink(url: string): Promise<{ ok: boolean; status?: number; error?: string }>;
}

function safeParseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[providers] Failed to parse JSON env, using fallback.`);
    return fallback;
  }
}

async function httpCheck(url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal, redirect: "follow" });
    clearTimeout(timer);
    return { ok: res.status < 400, status: res.status };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// ── Embed Provider (env-configured) ───────────────────────────────────────────

class EnvEmbedProvider implements VideoLinkProvider {
  readonly name = "embed";
  private movieTemplates: Array<{ name: string; url: string }>;
  private tvTemplates: Array<{ name: string; url: string }>;

  constructor() {
    this.movieTemplates = safeParseJson(process.env.EMBED_MOVIE_TEMPLATES, []);
    this.tvTemplates = safeParseJson(process.env.EMBED_TV_TEMPLATES, []);
  }

  supports(contentType: string) {
    return contentType === "movie" || contentType === "show";
  }

  async generateLinks(opts: { contentType: string; tmdbId?: number; season?: number; episode?: number }) {
    const { contentType, tmdbId, season, episode } = opts;
    const templates = contentType === "movie" ? this.movieTemplates : this.tvTemplates;
    if (!templates.length || !tmdbId) return [];
    if (contentType === "movie") {
      return templates.map((t, i) => ({
        serverName: t.name || `Embed ${i + 1}`,
        embedUrl: t.url.replace(/{tmdbId}/g, String(tmdbId)),
        quality: "HD",
        lang: "Multi",
      }));
    }
    return templates.map((t, i) => ({
      serverName: t.name || `Embed ${i + 1}`,
      embedUrl: t.url
        .replace(/{tmdbId}/g, String(tmdbId))
        .replace(/{season}/g, String(season ?? 1))
        .replace(/{episode}/g, String(episode ?? 1)),
      quality: "HD",
      lang: "Multi",
    }));
  }

  async checkLink(url: string) {
    return httpCheck(url);
  }
}

// ── Drama YouTube Provider (official playlists) ─────────────────────────────────

class DramaYoutubeProvider implements VideoLinkProvider {
  readonly name = "drama-youtube";

  supports(contentType: string) {
    return contentType === "drama";
  }

  async generateLinks(opts: { contentType: string; episode?: number; ytPlaylistId?: string }) {
    const { contentType, episode, ytPlaylistId } = opts;
    if (contentType !== "drama" || !ytPlaylistId) return [];
    return [
      {
        serverName: "YouTube",
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${ytPlaylistId}&index=${(episode ?? 1) - 1}&rel=0`,
        quality: "HD",
        lang: "Urdu",
      },
    ];
  }

  async checkLink(url: string) {
    return httpCheck(url);
  }
}

// ── External / Approved Provider Placeholder ─────────────────────────────────

class ExternalApiProvider implements VideoLinkProvider {
  readonly name = "external";
  private apiUrl: string | undefined;

  constructor() {
    this.apiUrl = process.env.VIDEO_LINK_API_URL;
  }

  supports(_contentType: string) {
    return !!this.apiUrl;
  }

  async generateLinks() {
    if (!this.apiUrl) return [];
    console.log(`[providers][external] API URL configured but placeholder is active — no links generated yet.`);
    return [];
  }

  async checkLink(url: string) {
    return httpCheck(url);
  }
}

// ── Factory ────────────────────────────────────────────────────────────────────

export function getProviders(): VideoLinkProvider[] {
  const providers: VideoLinkProvider[] = [];

  if (process.env.ENABLE_EMBED_PROVIDER !== "false") {
    providers.push(new EnvEmbedProvider());
  }
  if (process.env.ENABLE_EXTERNAL_PROVIDER === "true") {
    providers.push(new ExternalApiProvider());
  }
  providers.push(new DramaYoutubeProvider());

  return providers;
}
