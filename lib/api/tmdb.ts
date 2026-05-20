const TMDB_KEY = process.env.TMDB_API_KEY ?? "";
const BASE = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p/";

export const POSTER = (path: string | null | undefined, size = "w500"): string | null =>
  path ? `${IMG_BASE}${size}${path}` : null;

export const BACKDROP = (path: string | null | undefined, size = "w1280"): string | null =>
  path ? `${IMG_BASE}${size}${path}` : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tmdb(path: string, params: Record<string, string | number> = {}): Promise<any> {
  if (!TMDB_KEY) return null;
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", TMDB_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getTrendingMovies() {
  const data = await tmdb("/trending/movie/day");
  return data?.results ?? getMockMovies();
}

export async function getTrendingShows() {
  const data = await tmdb("/trending/tv/day");
  return data?.results ?? getMockShows();
}

export async function getPopularMovies(page = 1) {
  const data = await tmdb("/movie/popular", { page });
  return data?.results ?? getMockMovies();
}

export async function getPopularShows(page = 1) {
  const data = await tmdb("/tv/popular", { page });
  return data?.results ?? getMockShows();
}

export async function getNowPlayingMovies() {
  const data = await tmdb("/movie/now_playing");
  return data?.results ?? getMockMovies();
}

export async function getTopRatedMovies() {
  const data = await tmdb("/movie/top_rated");
  return data?.results ?? getMockMovies();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMovieDetails(id: number): Promise<any> {
  return tmdb(`/movie/${id}`, { append_to_response: "credits,videos,watch/providers" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getShowDetails(id: number): Promise<any> {
  return tmdb(`/tv/${id}`, { append_to_response: "credits,videos,watch/providers" });
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  const data = await tmdb("/discover/movie", { with_genres: genreId, page });
  return data?.results ?? getMockMovies();
}

export async function searchMulti(query: string) {
  const data = await tmdb("/search/multi", { query });
  return data?.results ?? [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMovieWatchProviders(id: number): Promise<any> {
  const data = await tmdb(`/movie/${id}/watch/providers`);
  return data?.results?.PK ?? data?.results?.US ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getShowWatchProviders(id: number): Promise<any> {
  const data = await tmdb(`/tv/${id}/watch/providers`);
  return data?.results?.PK ?? data?.results?.US ?? null;
}

export async function getSimilarMovies(id: number) {
  const data = await tmdb(`/movie/${id}/similar`);
  return data?.results?.slice(0, 12) ?? [];
}

export async function getSimilarShows(id: number) {
  const data = await tmdb(`/tv/${id}/similar`);
  return data?.results?.slice(0, 12) ?? [];
}

export async function getBollywoodMovies(page = 1) {
  const data = await tmdb("/discover/movie", { with_original_language: "hi", sort_by: "popularity.desc", page });
  return data?.results ?? getMockMovies();
}

export async function getUrduDramas(page = 1) {
  const data = await tmdb("/discover/tv", { with_original_language: "ur", sort_by: "popularity.desc", page });
  if (data?.results?.length) return data.results;
  // fallback: popular Pakistani/South Asian dramas
  const fallback = await tmdb("/discover/tv", { with_original_language: "hi", sort_by: "popularity.desc", page });
  return fallback?.results ?? getMockShows();
}

export async function getAnimeShows(page = 1) {
  const data = await tmdb("/discover/tv", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page });
  return data?.results ?? getMockShows();
}

export async function getUpcomingMovies() {
  const data = await tmdb("/movie/upcoming");
  return data?.results ?? getMockMovies();
}

export async function getTopRatedShows() {
  const data = await tmdb("/tv/top_rated");
  return data?.results ?? getMockShows();
}

export async function getComedyMovies() {
  const data = await tmdb("/discover/movie", { with_genres: "35", sort_by: "popularity.desc" });
  return data?.results ?? getMockMovies();
}

export async function getHorrorMovies() {
  const data = await tmdb("/discover/movie", { with_genres: "27", sort_by: "popularity.desc" });
  return data?.results ?? getMockMovies();
}

export async function getThrillerMovies() {
  const data = await tmdb("/discover/movie", { with_genres: "53", sort_by: "popularity.desc" });
  return data?.results ?? getMockMovies();
}

export async function getDocumentaries() {
  const data = await tmdb("/discover/movie", { with_genres: "99", sort_by: "popularity.desc" });
  return data?.results ?? getMockMovies();
}

export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
  { id: 53, name: "Thriller" },
];

// ── MOCK FALLBACK DATA ──

export interface MockMovie {
  id: number;
  title: string;
  poster_path: null;
  backdrop_path: null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
}

export interface MockShow {
  id: number;
  name: string;
  poster_path: null;
  backdrop_path: null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
  overview: string;
}

export function getMockMovies(): MockMovie[] {
  return [
    { id: 1022789, title: "Inside Out 2", poster_path: null, backdrop_path: null, vote_average: 7.6, release_date: "2024-06-14", genre_ids: [16, 18, 10751], overview: "Teenager Riley's mind headquarters is suddenly turned upside down by a new emotion." },
    { id: 653346, title: "Kingdom of the Planet of the Apes", poster_path: null, backdrop_path: null, vote_average: 6.9, release_date: "2024-05-08", genre_ids: [878, 28, 12], overview: "Many years after the reign of Caesar, a young ape goes on a journey." },
    { id: 519182, title: "Despicable Me 4", poster_path: null, backdrop_path: null, vote_average: 7.1, release_date: "2024-07-03", genre_ids: [16, 35, 10751], overview: "Gru and Lucy and their girls welcome a new member to the family." },
    { id: 573435, title: "Bad Boys: Ride or Die", poster_path: null, backdrop_path: null, vote_average: 7.3, release_date: "2024-06-05", genre_ids: [28, 80, 53], overview: "After their late Police Captain is framed, Lowrey and Burnett try to clear his name." },
    { id: 748783, title: "The Garfield Movie", poster_path: null, backdrop_path: null, vote_average: 6.7, release_date: "2024-05-22", genre_ids: [16, 35, 12], overview: "Garfield, the world-famous, lazy Monday-hating cat, is about to have a wild outdoor adventure." },
    { id: 614933, title: "Atlas", poster_path: null, backdrop_path: null, vote_average: 6.1, release_date: "2024-05-24", genre_ids: [878, 28, 53], overview: "A brilliant data analyst with a deep distrust of AI discovers it may be her only hope." },
    { id: 438631, title: "Dune: Part Two", poster_path: null, backdrop_path: null, vote_average: 8.3, release_date: "2024-03-01", genre_ids: [878, 12, 18], overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge." },
    { id: 823464, title: "Godzilla x Kong", poster_path: null, backdrop_path: null, vote_average: 7.0, release_date: "2024-03-27", genre_ids: [28, 878, 12], overview: "The epic battle continues as Godzilla and Kong must reunite against a colossal undiscovered threat." },
    { id: 940551, title: "Migration", poster_path: null, backdrop_path: null, vote_average: 7.1, release_date: "2023-12-22", genre_ids: [16, 35, 10751], overview: "A family of ducks try to convince their overprotective father to let them migrate." },
    { id: 792307, title: "Poor Things", poster_path: null, backdrop_path: null, vote_average: 8.0, release_date: "2023-12-08", genre_ids: [18, 35, 878], overview: "The incredible tale about the fantastical evolution of Bella Baxter." },
    { id: 866398, title: "The Beekeeper", poster_path: null, backdrop_path: null, vote_average: 7.2, release_date: "2024-01-12", genre_ids: [28, 53, 80], overview: "A beekeeper's brutal campaign of revenge takes on national stakes after he discovers the truth." },
    { id: 1072790, title: "Anyone But You", poster_path: null, backdrop_path: null, vote_average: 6.9, release_date: "2023-12-22", genre_ids: [10749, 35], overview: "After an amazing first date, Bea and Ben's fiery attraction turns ice cold." },
  ];
}

export function getMockShows(): MockShow[] {
  return [
    { id: 1396, name: "Breaking Bad", poster_path: null, backdrop_path: null, vote_average: 9.5, first_air_date: "2008-01-20", genre_ids: [18, 80], overview: "A high school chemistry teacher turned methamphetamine manufacturer." },
    { id: 94997, name: "House of the Dragon", poster_path: null, backdrop_path: null, vote_average: 8.4, first_air_date: "2022-08-21", genre_ids: [18, 10765], overview: "An internal succession war within House Targaryen at the height of its power." },
    { id: 66732, name: "Stranger Things", poster_path: null, backdrop_path: null, vote_average: 8.7, first_air_date: "2016-07-15", genre_ids: [18, 9648, 878], overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments." },
    { id: 100088, name: "The Last of Us", poster_path: null, backdrop_path: null, vote_average: 8.7, first_air_date: "2023-01-15", genre_ids: [18, 10759, 878], overview: "Joel and Ellie traverse the post-apocalyptic United States." },
    { id: 60625, name: "Rick and Morty", poster_path: null, backdrop_path: null, vote_average: 8.7, first_air_date: "2013-12-02", genre_ids: [16, 35, 878], overview: "An animated series following a mad scientist and his grandson." },
    { id: 84958, name: "Loki", poster_path: null, backdrop_path: null, vote_average: 8.2, first_air_date: "2021-06-09", genre_ids: [18, 10765, 10759], overview: "The mercurial villain Loki resumes his role as the God of Mischief." },
    { id: 71912, name: "The Witcher", poster_path: null, backdrop_path: null, vote_average: 8.0, first_air_date: "2019-12-20", genre_ids: [10765, 10759, 18], overview: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world." },
    { id: 93405, name: "Squid Game", poster_path: null, backdrop_path: null, vote_average: 7.9, first_air_date: "2021-09-17", genre_ids: [10759, 18, 9648], overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games." },
    { id: 209867, name: "The Bear", poster_path: null, backdrop_path: null, vote_average: 8.6, first_air_date: "2022-06-23", genre_ids: [18, 35], overview: "A young chef from the fine-dining world returns to Chicago to run his family's sandwich shop." },
    { id: 135157, name: "Shogun", poster_path: null, backdrop_path: null, vote_average: 8.9, first_air_date: "2024-02-27", genre_ids: [18, 10759], overview: "A shipwrecked English navigator strives to become a samurai in feudal Japan." },
    { id: 90462, name: "Chucky", poster_path: null, backdrop_path: null, vote_average: 7.4, first_air_date: "2021-10-12", genre_ids: [27, 9648], overview: "After a vintage Chucky doll turns up at a yard sale, a series of murders occur." },
    { id: 85552, name: "Euphoria", poster_path: null, backdrop_path: null, vote_average: 8.4, first_air_date: "2019-06-16", genre_ids: [18], overview: "A group of high school students navigate love and friendships through a world of drugs." },
  ];
}
