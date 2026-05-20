export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  category: string;
}

const RSS_FEEDS = [
  { url: "https://feeds.bbci.co.uk/sport/cricket/rss.xml", source: "BBC Cricket", category: "Cricket" },
  { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Football", category: "Football" },
  { url: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml", source: "ESPNcricinfo", category: "Cricket" },
  { url: "https://www.dawn.com/feeds/sports", source: "Dawn Sports", category: "Pakistan" },
  { url: "https://feeds.skysports.com/skysports/football", source: "Sky Sports", category: "Football" },
];

function parseRssItems(xml: string, source: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  for (const item of itemMatches.slice(0, 5)) {
    const title = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() ?? "";
    const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
    const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";
    const desc = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]
      ?.replace(/<[^>]+>/g, "")
      ?.trim()
      ?.slice(0, 200) ?? "";
    if (title && link) items.push({ title, link, pubDate, description: desc, source, category });
  }
  return items;
}

export async function getLatestNews(categories?: string[]): Promise<NewsItem[]> {
  const feeds = categories
    ? RSS_FEEDS.filter((f) => categories.includes(f.category))
    : RSS_FEEDS;

  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const res = await fetch(feed.url, {
        next: { revalidate: 1800 },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LiveStreamTV/1.0)" },
      });
      if (!res.ok) return [];
      const xml = await res.text();
      return parseRssItems(xml, feed.source, feed.category);
    })
  );

  const allItems = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  if (allItems.length === 0) return getMockNews();

  return allItems
    .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
    .slice(0, 20);
}

export async function getCricketNews(): Promise<NewsItem[]> {
  return getLatestNews(["Cricket"]);
}

export async function getFootballNews(): Promise<NewsItem[]> {
  return getLatestNews(["Football"]);
}

// ── MOCK FALLBACK ──

export function getMockNews(): NewsItem[] {
  return [
    { title: "Pakistan beat India in Asia Cup thriller", link: "#", pubDate: new Date().toISOString(), description: "Pakistan clinched a dramatic victory over India in a nail-biting Asia Cup encounter.", source: "Dawn Sports", category: "Cricket" },
    { title: "PSL 2026: Season Preview and Predictions", link: "#", pubDate: new Date().toISOString(), description: "All six teams are ready for the Pakistan Super League season opener.", source: "Geo Sports", category: "Cricket" },
    { title: "Champions League quarter-final results", link: "#", pubDate: new Date().toISOString(), description: "Real Madrid and Man City advance after dramatic quarter-final ties.", source: "BBC Football", category: "Football" },
    { title: "Premier League title race heats up", link: "#", pubDate: new Date().toISOString(), description: "Arsenal, City and Liverpool separated by just two points at the top.", source: "Sky Sports", category: "Football" },
    { title: "ICC announces new World Test Championship schedule", link: "#", pubDate: new Date().toISOString(), description: "The ICC has confirmed the fixtures for the next WTC cycle.", source: "ESPNcricinfo", category: "Cricket" },
    { title: "Babar Azam returns to form with century", link: "#", pubDate: new Date().toISOString(), description: "Pakistan captain Babar Azam hit a brilliant century in the first Test.", source: "Dawn Sports", category: "Pakistan" },
  ];
}
