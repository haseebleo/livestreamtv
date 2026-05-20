const SPORTSDB = "https://www.thesportsdb.com/api/v1/json/3";

export interface FootballMatch {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
  strLeague: string;
  dateEvent: string;
  strTime: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  intRound?: string;
}

// TheSportsDB league IDs
const LEAGUE_IDS = {
  premierLeague: "4328",
  laLiga: "4335",
  bundesliga: "4331",
  serieA: "4332",
  ligue1: "4334",
  ucl: "4480",
  pakistanFootball: "4720",
};

async function sportsdb(path: string): Promise<FootballMatch[] | null> {
  try {
    const res = await fetch(`${SPORTSDB}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.events ?? json.results ?? null;
  } catch {
    return null;
  }
}

export async function getNextLeagueMatches(leagueId: string): Promise<FootballMatch[]> {
  return (await sportsdb(`/eventsnextleague.php?id=${leagueId}`)) ?? [];
}

export async function getLastLeagueMatches(leagueId: string): Promise<FootballMatch[]> {
  return (await sportsdb(`/eventspastleague.php?id=${leagueId}`)) ?? [];
}

export async function getAllUpcomingMatches(): Promise<FootballMatch[]> {
  const [pl, la, bl, sa] = await Promise.all([
    getNextLeagueMatches(LEAGUE_IDS.premierLeague),
    getNextLeagueMatches(LEAGUE_IDS.laLiga),
    getNextLeagueMatches(LEAGUE_IDS.bundesliga),
    getNextLeagueMatches(LEAGUE_IDS.serieA),
  ]);
  return [...pl, ...la, ...bl, ...sa]
    .sort((a, b) => new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime())
    .slice(0, 20);
}

export async function getAllRecentMatches(): Promise<FootballMatch[]> {
  const [pl, la, bl, sa, ucl] = await Promise.all([
    getLastLeagueMatches(LEAGUE_IDS.premierLeague),
    getLastLeagueMatches(LEAGUE_IDS.laLiga),
    getLastLeagueMatches(LEAGUE_IDS.bundesliga),
    getLastLeagueMatches(LEAGUE_IDS.serieA),
    getLastLeagueMatches(LEAGUE_IDS.ucl),
  ]);
  return [...pl, ...la, ...bl, ...sa, ...ucl]
    .sort((a, b) => new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime())
    .slice(0, 20);
}

export const LEAGUE_FLAGS: Record<string, string> = {
  "English Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Spanish La Liga": "🇪🇸",
  "German Bundesliga": "🇩🇪",
  "Italian Serie A": "🇮🇹",
  "French Ligue 1": "🇫🇷",
  "UEFA Champions League": "🏆",
  "UEFA Europa League": "🏆",
};

export { LEAGUE_IDS };

// ── MOCK FALLBACK ──

export function getMockFootballMatches() {
  return [
    { idEvent: "1", strEvent: "Manchester City vs Arsenal", strHomeTeam: "Manchester City", strAwayTeam: "Arsenal", intHomeScore: "2", intAwayScore: "1", strStatus: "FT", strLeague: "English Premier League", dateEvent: new Date().toISOString().split("T")[0], strTime: "20:00:00" },
    { idEvent: "2", strEvent: "Real Madrid vs Barcelona", strHomeTeam: "Real Madrid", strAwayTeam: "Barcelona", intHomeScore: "3", intAwayScore: "2", strStatus: "FT", strLeague: "Spanish La Liga", dateEvent: new Date().toISOString().split("T")[0], strTime: "21:00:00" },
    { idEvent: "3", strEvent: "Bayern Munich vs Dortmund", strHomeTeam: "Bayern Munich", strAwayTeam: "Borussia Dortmund", intHomeScore: "1", intAwayScore: "1", strStatus: "FT", strLeague: "German Bundesliga", dateEvent: new Date().toISOString().split("T")[0], strTime: "18:30:00" },
    { idEvent: "4", strEvent: "PSG vs Lyon", strHomeTeam: "PSG", strAwayTeam: "Lyon", intHomeScore: null, intAwayScore: null, strStatus: "NS", strLeague: "French Ligue 1", dateEvent: new Date(Date.now() + 86400000).toISOString().split("T")[0], strTime: "20:45:00" },
    { idEvent: "5", strEvent: "Inter Milan vs AC Milan", strHomeTeam: "Inter Milan", strAwayTeam: "AC Milan", intHomeScore: "2", intAwayScore: "0", strStatus: "FT", strLeague: "Italian Serie A", dateEvent: new Date().toISOString().split("T")[0], strTime: "19:45:00" },
    { idEvent: "6", strEvent: "Chelsea vs Liverpool", strHomeTeam: "Chelsea", strAwayTeam: "Liverpool", intHomeScore: null, intAwayScore: null, strStatus: "NS", strLeague: "English Premier League", dateEvent: new Date(Date.now() + 172800000).toISOString().split("T")[0], strTime: "16:30:00" },
  ] as FootballMatch[];
}
