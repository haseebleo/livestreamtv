const SPORTS_DB_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const TMDB_BASE = "https://api.themoviedb.org/3";

export async function getLiveFootballMatches() {
  try {
    const res = await fetch(`${SPORTS_DB_BASE}/livescore.php`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.events || [];
  } catch {
    return getMockFootballMatches();
  }
}

export async function getUpcomingMatches(league: string) {
  try {
    const res = await fetch(`${SPORTS_DB_BASE}/eventsnextleague.php?id=${league}`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return data.events || [];
  } catch {
    return [];
  }
}

export async function getTrendingMovies(apiKey: string) {
  if (!apiKey) return getMockMovies();
  try {
    const res = await fetch(`${TMDB_BASE}/trending/movie/week?api_key=${apiKey}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.results || [];
  } catch {
    return getMockMovies();
  }
}

export async function getTrendingShows(apiKey: string) {
  if (!apiKey) return getMockShows();
  try {
    const res = await fetch(`${TMDB_BASE}/trending/tv/week?api_key=${apiKey}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.results || [];
  } catch {
    return getMockShows();
  }
}

export function getMockCricketMatches() {
  return [
    {
      id: "1",
      teams: { home: { name: "Pakistan", score: "245/6", overs: "42.3" }, away: { name: "India", score: "198/8", overs: "38.0" } },
      status: "live",
      tournament: "Asia Cup 2026",
      venue: "Gaddafi Stadium, Lahore",
      format: "ODI",
    },
    {
      id: "2",
      teams: { home: { name: "England", score: "312/4", overs: "50.0" }, away: { name: "Australia", score: "289/7", overs: "49.2" } },
      status: "live",
      tournament: "ICC World Cup 2026",
      venue: "Lord's, London",
      format: "ODI",
    },
    {
      id: "3",
      teams: { home: { name: "South Africa", score: "-", overs: "-" }, away: { name: "New Zealand", score: "-", overs: "-" } },
      status: "upcoming",
      tournament: "Test Series",
      venue: "Wanderers, Johannesburg",
      format: "Test",
      startTime: "Tomorrow 10:00 AM",
    },
    {
      id: "4",
      teams: { home: { name: "West Indies", score: "178/3", overs: "15.0" }, away: { name: "Sri Lanka", score: "180/6", overs: "20.0" } },
      status: "completed",
      tournament: "T20 World Cup 2026",
      venue: "Barbados",
      format: "T20",
      result: "West Indies won by 7 wickets",
    },
  ];
}

export function getMockFootballMatches() {
  return [
    {
      id: "1",
      homeTeam: "Manchester City",
      awayTeam: "Arsenal",
      homeScore: 2,
      awayScore: 1,
      status: "live",
      minute: "67",
      league: "Premier League",
      leagueLogo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    },
    {
      id: "2",
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      homeScore: 3,
      awayScore: 2,
      status: "live",
      minute: "82",
      league: "La Liga",
      leagueLogo: "🇪🇸",
    },
    {
      id: "3",
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      homeScore: 1,
      awayScore: 1,
      status: "live",
      minute: "45+2",
      league: "Bundesliga",
      leagueLogo: "🇩🇪",
    },
    {
      id: "4",
      homeTeam: "PSG",
      awayTeam: "Lyon",
      homeScore: 0,
      awayScore: 0,
      status: "upcoming",
      kickoff: "20:45",
      league: "Ligue 1",
      leagueLogo: "🇫🇷",
    },
    {
      id: "5",
      homeTeam: "Inter Milan",
      awayTeam: "AC Milan",
      homeScore: 2,
      awayScore: 0,
      status: "completed",
      league: "Serie A",
      leagueLogo: "🇮🇹",
    },
  ];
}

export function getMockMovies() {
  return [
    { id: 1, title: "Avengers: Doomsday", poster_path: null, vote_average: 8.4, release_date: "2026-05-01", genre: "Action", streaming: ["Disney+", "Netflix"] },
    { id: 2, title: "Mission: Impossible 8", poster_path: null, vote_average: 7.9, release_date: "2026-05-15", genre: "Action", streaming: ["Paramount+"] },
    { id: 3, title: "The Batman 2", poster_path: null, vote_average: 8.1, release_date: "2026-04-20", genre: "Action", streaming: ["HBO Max", "Amazon Prime"] },
    { id: 4, title: "Blade Runner 3", poster_path: null, vote_average: 7.6, release_date: "2026-03-12", genre: "Sci-Fi", streaming: ["Netflix"] },
    { id: 5, title: "Spider-Man 4", poster_path: null, vote_average: 8.7, release_date: "2026-06-10", genre: "Action", streaming: ["Disney+", "Netflix"] },
    { id: 6, title: "Dune: Messiah", poster_path: null, vote_average: 8.5, release_date: "2026-07-01", genre: "Sci-Fi", streaming: ["HBO Max"] },
  ];
}

export function getMockShows() {
  return [
    { id: 1, name: "House of the Dragon S3", poster_path: null, vote_average: 8.6, first_air_date: "2026-04-01", genre: "Fantasy", streaming: ["HBO Max"] },
    { id: 2, name: "Stranger Things 5", poster_path: null, vote_average: 8.8, first_air_date: "2026-05-20", genre: "Sci-Fi Horror", streaming: ["Netflix"] },
    { id: 3, name: "The Last of Us S3", poster_path: null, vote_average: 9.0, first_air_date: "2026-03-15", genre: "Drama", streaming: ["HBO Max"] },
    { id: 4, name: "Wednesday S2", poster_path: null, vote_average: 7.8, first_air_date: "2026-02-28", genre: "Mystery", streaming: ["Netflix"] },
    { id: 5, name: "Peaky Blinders: Return", poster_path: null, vote_average: 8.9, first_air_date: "2026-06-05", genre: "Crime", streaming: ["Netflix", "BBC"] },
    { id: 6, name: "The Boys S5", poster_path: null, vote_average: 8.7, first_air_date: "2026-07-15", genre: "Superhero", streaming: ["Amazon Prime"] },
  ];
}
