const YT_KEY = process.env.YOUTUBE_API_KEY ?? "";

export interface YTVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export async function searchYouTube(
  query: string,
  maxResults = 6,
  duration: "any" | "long" | "medium" = "long"
): Promise<YTVideo[]> {
  if (!YT_KEY) return [];
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", YT_KEY);
    url.searchParams.set("q", query);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(maxResults));
    url.searchParams.set("videoDuration", duration);
    url.searchParams.set("relevanceLanguage", "ur");
    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items ?? []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url ?? "",
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt?.slice(0, 10) ?? "",
    }));
  } catch {
    return [];
  }
}

export function buildMovieQuery(title: string, year?: string | number): string {
  const base = `${title}${year ? ` ${year}` : ""}`;
  return `${base} full movie`;
}

export function buildDramaQuery(dramaTitle: string, ep: number, channel?: string): string {
  return `${dramaTitle} episode ${ep}${channel ? ` ${channel}` : ""} official`;
}

export function buildTrailerQuery(title: string, year?: string | number): string {
  return `${title}${year ? ` ${year}` : ""} official trailer`;
}
