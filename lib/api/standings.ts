const SPORTSDB = "https://www.thesportsdb.com/api/v1/json/3";

export interface StandingEntry {
  rank: number;
  team: string;
  badge: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string;
  description: string;
}

export interface LeagueStanding {
  leagueId: string;
  leagueName: string;
  flag: string;
  season: string;
  table: StandingEntry[];
}

export const STANDING_LEAGUES = [
  { id: "4328", name: "English Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "4335", name: "Spanish La Liga",          flag: "🇪🇸" },
  { id: "4331", name: "German Bundesliga",         flag: "🇩🇪" },
  { id: "4332", name: "Italian Serie A",           flag: "🇮🇹" },
  { id: "4334", name: "French Ligue 1",            flag: "🇫🇷" },
];

const SEASON = "2025-2026";

async function fetchStandings(league: typeof STANDING_LEAGUES[number]): Promise<LeagueStanding> {
  try {
    const res = await fetch(
      `${SPORTSDB}/lookuptable.php?l=${league.id}&s=${SEASON}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("not ok");
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = data.table ?? [];

    const table: StandingEntry[] = rows.map((r) => ({
      rank:          parseInt(r.intRank ?? "0"),
      team:          r.strTeam ?? "",
      badge:         r.strBadge ?? null,
      played:        parseInt(r.intPlayed ?? "0"),
      won:           parseInt(r.intWin ?? "0"),
      drawn:         parseInt(r.intDraw ?? "0"),
      lost:          parseInt(r.intLoss ?? "0"),
      goalsFor:      parseInt(r.intGoalsFor ?? "0"),
      goalsAgainst:  parseInt(r.intGoalsAgainst ?? "0"),
      goalDiff:      parseInt(r.intGoalDifference ?? "0"),
      points:        parseInt(r.intPoints ?? "0"),
      form:          r.strForm ?? "",
      description:   r.strDescription ?? "",
    }));

    return { leagueId: league.id, leagueName: league.name, flag: league.flag, season: SEASON, table };
  } catch {
    return { leagueId: league.id, leagueName: league.name, flag: league.flag, season: SEASON, table: [] };
  }
}

export async function getAllStandings(): Promise<LeagueStanding[]> {
  const results = await Promise.all(STANDING_LEAGUES.map(fetchStandings));
  return results;
}

export async function getLeagueStandings(leagueId: string): Promise<LeagueStanding | null> {
  const league = STANDING_LEAGUES.find((l) => l.id === leagueId);
  if (!league) return null;
  return fetchStandings(league);
}
