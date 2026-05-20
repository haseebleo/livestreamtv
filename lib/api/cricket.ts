const CRICAPI_KEY = process.env.CRICAPI_KEY ?? "";
const BASE = "https://api.cricapi.com/v1";

export interface CricMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  score: { r: number; w: number; o: number; inning: string }[];
  series_id?: string;
}

async function cricapi(path: string): Promise<CricMatch[] | null> {
  if (!CRICAPI_KEY) return null;
  try {
    const res = await fetch(`${BASE}${path}?apikey=${CRICAPI_KEY}&offset=0`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success") return null;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentMatches(): Promise<CricMatch[]> {
  const data = await cricapi("/currentMatches");
  return data ?? getMockCricketMatches();
}

export async function getUpcomingMatches(): Promise<CricMatch[]> {
  const data = await cricapi("/matches");
  if (!data) return getMockCricketMatches().filter((m) => m.status === "upcoming");
  return data.filter((m) => m.status === "upcoming" || !m.score?.length);
}

export function getMatchStatus(match: CricMatch): "live" | "upcoming" | "completed" {
  const s = match.status.toLowerCase();
  if (s === "in progress" || s.includes("live") || (match.score?.length > 0 && !s.includes("won") && !s.includes("draw") && !s.includes("no result"))) return "live";
  if (s === "match not started" || s.includes("yet to begin")) return "upcoming";
  return "completed";
}

export function formatScore(match: CricMatch, teamName: string): string {
  const inning = match.score?.find((s) => s.inning.toLowerCase().includes(teamName.toLowerCase()));
  if (!inning) return "-";
  return `${inning.r}/${inning.w} (${inning.o} ov)`;
}

// ── MOCK FALLBACK ──

export function getMockCricketMatches(): CricMatch[] {
  return [
    {
      id: "1",
      name: "Pakistan vs India, 1st ODI",
      matchType: "odi",
      status: "In Progress",
      venue: "Gaddafi Stadium, Lahore",
      date: new Date().toISOString(),
      teams: ["Pakistan", "India"],
      score: [
        { r: 245, w: 6, o: 42.3, inning: "Pakistan Inning 1" },
        { r: 198, w: 8, o: 38.0, inning: "India Inning 1" },
      ],
    },
    {
      id: "2",
      name: "England vs Australia, 2nd Test",
      matchType: "test",
      status: "In Progress",
      venue: "Lord's, London",
      date: new Date().toISOString(),
      teams: ["England", "Australia"],
      score: [
        { r: 312, w: 4, o: 89.0, inning: "England Inning 1" },
        { r: 289, w: 7, o: 95.2, inning: "Australia Inning 1" },
      ],
    },
    {
      id: "3",
      name: "South Africa vs New Zealand, 1st T20",
      matchType: "t20",
      status: "Match not started",
      venue: "Wanderers, Johannesburg",
      date: new Date(Date.now() + 86400000).toISOString(),
      teams: ["South Africa", "New Zealand"],
      score: [],
    },
    {
      id: "4",
      name: "West Indies vs Sri Lanka, T20 World Cup",
      matchType: "t20",
      status: "West Indies won by 7 wickets",
      venue: "Barbados",
      date: new Date(Date.now() - 86400000).toISOString(),
      teams: ["West Indies", "Sri Lanka"],
      score: [
        { r: 178, w: 3, o: 15.0, inning: "West Indies Inning 1" },
        { r: 177, w: 6, o: 20.0, inning: "Sri Lanka Inning 1" },
      ],
    },
    {
      id: "5",
      name: "Bangladesh vs Afghanistan, Asia Cup",
      matchType: "odi",
      status: "In Progress",
      venue: "Shere Bangla, Dhaka",
      date: new Date().toISOString(),
      teams: ["Bangladesh", "Afghanistan"],
      score: [
        { r: 156, w: 5, o: 32.0, inning: "Bangladesh Inning 1" },
      ],
    },
    {
      id: "6",
      name: "India vs South Africa, T20 Series",
      matchType: "t20",
      status: "India won by 15 runs",
      venue: "Wankhede, Mumbai",
      date: new Date(Date.now() - 172800000).toISOString(),
      teams: ["India", "South Africa"],
      score: [
        { r: 192, w: 4, o: 20.0, inning: "India Inning 1" },
        { r: 177, w: 8, o: 20.0, inning: "South Africa Inning 1" },
      ],
    },
  ];
}
