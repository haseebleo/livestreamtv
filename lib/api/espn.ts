// ESPN public API — no key required, real-time football scores
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

export const FOOTBALL_LEAGUES = [
  { slug: "eng.1",         name: "English Premier League",  flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { slug: "esp.1",         name: "Spanish La Liga",          flag: "🇪🇸" },
  { slug: "ger.1",         name: "German Bundesliga",        flag: "🇩🇪" },
  { slug: "ita.1",         name: "Italian Serie A",          flag: "🇮🇹" },
  { slug: "fra.1",         name: "French Ligue 1",           flag: "🇫🇷" },
  { slug: "uefa.champions",name: "UEFA Champions League",    flag: "🏆" },
  { slug: "uefa.europa",   name: "UEFA Europa League",       flag: "🥈" },
  { slug: "usa.1",         name: "MLS",                      flag: "🇺🇸" },
  { slug: "tur.1",         name: "Turkish Süper Lig",        flag: "🇹🇷" },
  { slug: "por.1",         name: "Primeira Liga",             flag: "🇵🇹" },
  { slug: "ned.1",         name: "Eredivisie",               flag: "🇳🇱" },
  { slug: "sco.1",         name: "Scottish Premiership",     flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
];

export interface ESPNMatch {
  id: string;
  name: string;
  date: string;
  league: string;
  leagueFlag: string;
  leagueSlug: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string | null;
  awayLogo: string | null;
  homeScore: string | null;
  awayScore: string | null;
  status: "live" | "upcoming" | "completed";
  displayClock: string;
  detail: string;
  venue: string | null;
  minute: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEvent(event: any, league: typeof FOOTBALL_LEAGUES[number]): ESPNMatch {
  const comp  = event.competitions?.[0] ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comps: any[] = comp.competitors ?? [];
  const home  = comps.find((c) => c.homeAway === "home") ?? comps[0] ?? {};
  const away  = comps.find((c) => c.homeAway === "away") ?? comps[1] ?? {};
  const st    = event.status?.type ?? {};
  const state: string = st.state ?? "pre";  // "pre" | "in" | "post"

  const status: ESPNMatch["status"] =
    state === "in"   ? "live"      :
    state === "post" ? "completed" : "upcoming";

  const clock: number = event.status?.clock ?? 0;

  return {
    id:          event.id ?? "",
    name:        event.name ?? "",
    date:        event.date ?? "",
    league:      league.name,
    leagueFlag:  league.flag,
    leagueSlug:  league.slug,
    homeTeam:    home.team?.displayName ?? "Home",
    awayTeam:    away.team?.displayName ?? "Away",
    homeLogo:    home.team?.logo ?? null,
    awayLogo:    away.team?.logo ?? null,
    homeScore:   status !== "upcoming" ? (home.score ?? null) : null,
    awayScore:   status !== "upcoming" ? (away.score ?? null) : null,
    status,
    displayClock: event.status?.displayClock ?? "0:00",
    detail:       st.shortDetail ?? "",
    venue:        comp.venue?.fullName ?? null,
    minute:       status === "live" ? Math.round(clock / 60) : null,
  };
}

async function fetchLeague(league: typeof FOOTBALL_LEAGUES[number]): Promise<ESPNMatch[]> {
  try {
    const res = await fetch(`${ESPN_BASE}/soccer/${league.slug}/scoreboard`, {
      next: { revalidate: 60 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.events ?? []).map((e: any) => parseEvent(e, league));
  } catch {
    return [];
  }
}

export async function getAllFootballMatches(): Promise<ESPNMatch[]> {
  const results = await Promise.allSettled(FOOTBALL_LEAGUES.map(fetchLeague));
  const all = results
    .filter((r): r is PromiseFulfilledResult<ESPNMatch[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const ORDER = { live: 0, upcoming: 1, completed: 2 } as const;
  return all.sort((a, b) => {
    if (ORDER[a.status] !== ORDER[b.status]) return ORDER[a.status] - ORDER[b.status];
    if (a.status === "upcoming")  return new Date(a.date).getTime() - new Date(b.date).getTime();
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getLiveMatches():     Promise<ESPNMatch[]> { return (await getAllFootballMatches()).filter((m) => m.status === "live"); }
export async function getUpcomingMatches(): Promise<ESPNMatch[]> { return (await getAllFootballMatches()).filter((m) => m.status === "upcoming"); }
export async function getRecentMatches():   Promise<ESPNMatch[]> { return (await getAllFootballMatches()).filter((m) => m.status === "completed"); }

// ── ESPN Cricket (no key, limited tournament coverage) ──

export const CRICKET_TOURNAMENTS = [
  { slug: "icc-cricket-world-cup",       name: "ICC Cricket World Cup" },
  { slug: "icc-world-test-championship", name: "World Test Championship" },
  { slug: "pakistan-super-league",       name: "Pakistan Super League" },
  { slug: "indian-premier-league",       name: "Indian Premier League" },
  { slug: "t20-blast",                   name: "T20 Blast" },
  { slug: "the-hundred",                 name: "The Hundred" },
];

export interface ESPNCricketMatch {
  id: string;
  name: string;
  date: string;
  tournament: string;
  status: "live" | "upcoming" | "completed";
  detail: string;
  venue: string | null;
}

async function fetchCricketTournament(t: typeof CRICKET_TOURNAMENTS[number]): Promise<ESPNCricketMatch[]> {
  try {
    const res = await fetch(`${ESPN_BASE}/cricket/${t.slug}/scoreboard`, {
      next: { revalidate: 60 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.events ?? []).map((e: any) => {
      const state: string = e.status?.type?.state ?? "pre";
      return {
        id:         e.id ?? "",
        name:       e.name ?? "",
        date:       e.date ?? "",
        tournament: t.name,
        status:     state === "in" ? "live" : state === "post" ? "completed" : "upcoming",
        detail:     e.status?.type?.shortDetail ?? "",
        venue:      e.competitions?.[0]?.venue?.fullName ?? null,
      } as ESPNCricketMatch;
    });
  } catch {
    return [];
  }
}

export async function getESPNCricket(): Promise<ESPNCricketMatch[]> {
  const results = await Promise.allSettled(CRICKET_TOURNAMENTS.map(fetchCricketTournament));
  return results
    .filter((r): r is PromiseFulfilledResult<ESPNCricketMatch[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .sort((a, b) => {
      const ORDER = { live: 0, upcoming: 1, completed: 2 } as const;
      if (ORDER[a.status] !== ORDER[b.status]) return ORDER[a.status] - ORDER[b.status];
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}
