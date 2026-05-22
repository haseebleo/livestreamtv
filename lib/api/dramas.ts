/**
 * Pakistani drama metadata scraper.
 * Fetches publicly available drama info from Geo, ARY, Hum TV.
 * Only metadata is collected (title, synopsis, cast, thumbnails).
 * Video embeds use each channel's official YouTube uploads.
 */

export interface DramaEpisode {
  ep: number;
  title: string;
  ytId: string;
  duration?: string;
  airDate?: string;
}

export interface Drama {
  slug: string;
  title: string;
  channel: "Geo" | "ARY" | "Hum TV" | "Express";
  category: "Drama" | "Telefilm" | "Serial";
  language: "Urdu";
  genre: string[];
  status: "ongoing" | "completed";
  totalEpisodes?: number;
  airDay?: string;
  airTime?: string;
  synopsis: string;
  thumbnail: string;
  cast: string[];
  ytChannelId: string;
  ytPlaylistId?: string;
  episodes: DramaEpisode[];
  year: number;
}

// ── Official YouTube channel IDs ──────────────────────────────────────────────
const YT_CHANNELS = {
  geo:     "UCnBsO0I_4KKJD-GYJmBi5xA", // Geo TV Official (backup — geo uses multiple)
  geoEnt:  "UCCezIgC97PvUuR4_gbFUs5g", // Geo Entertainment
  ary:     "UCiEOEFHGV2xTnlXOmMUmfpg", // ARY Digital
  humTv:   "UC12up-gRsOzHImYZJXN5Uvg", // Hum TV
  express: "UCRxv8mMXOb0oGaW4WAlMH3A", // Express Entertainment
};

// ── Drama catalogue ────────────────────────────────────────────────────────────
// Each drama links to a YouTube playlist so episodes are always up to date.
// Add new dramas at the top of the array; slug must be kebab-case unique.
export const DRAMAS: Drama[] = [
  {
    slug: "hatim",
    title: "Hatim",
    channel: "Geo",
    category: "Drama",
    language: "Urdu",
    genre: ["Adventure", "Fantasy", "Family"],
    status: "completed",
    totalEpisodes: 21,
    synopsis:
      "Hatim is an epic fantasy adventure drama based on the legendary hero Hatim Tai. The story follows Hatim, a brave and noble prince who embarks on seven quests to help those in need and bring peace to the kingdom. A timeless tale of courage, love, and sacrifice.",
    thumbnail: "https://i.ytimg.com/vi/6nkKS3TrFrU/maxresdefault.jpg",
    cast: ["Faisal Qureshi", "Sana", "Noman Habib", "Resham"],
    ytChannelId: YT_CHANNELS.geoEnt,
    ytPlaylistId: "PLn45iYkKKt98n6bvZibAd3MKbABetPSqT",
    year: 2003,
    airDay: "Sunday",
    airTime: "08:00 PM",
    episodes: Array.from({ length: 21 }, (_, i) => ({
      ep: i + 1,
      title: `Hatim — Episode ${i + 1}`,
      ytId: "",
    })),
  },
  {
    slug: "tere-bin",
    title: "Tere Bin",
    channel: "Geo",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Drama"],
    status: "completed",
    totalEpisodes: 78,
    synopsis:
      "A romantic drama depicting the complex love story of Meerab and Murtasim. Their lives collide through a forced engagement, and what begins as resentment slowly transforms into deep love. A story of family pressures, pride, and the power of love.",
    thumbnail: "https://i.ytimg.com/vi/X8zB3OJLsOM/maxresdefault.jpg",
    cast: ["Wahaj Ali", "Yumna Zaidi", "Hira Salman"],
    ytChannelId: YT_CHANNELS.geoEnt,
    ytPlaylistId: "PLn45iYkKKt98LSmqTv5tOJoUEBFVQ7vMr",
    year: 2023,
    airDay: "Monday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "mere-humsafar",
    title: "Mere Humsafar",
    channel: "ARY",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Family"],
    status: "completed",
    totalEpisodes: 34,
    synopsis:
      "Mere Humsafar follows Hala, an innocent girl who faces hardships from her stepmother. Her life changes when she gets married to Hamza. A heartwarming love story with emotional twists and family conflicts.",
    thumbnail: "https://i.ytimg.com/vi/S2O-rMmBuZ4/maxresdefault.jpg",
    cast: ["Farhan Saeed", "Hania Aamir", "Samina Ahmad"],
    ytChannelId: YT_CHANNELS.ary,
    ytPlaylistId: "PLnVMWyjC4pIcGtanSoCR1e7BX7k3LCuqX",
    year: 2022,
    airDay: "Saturday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "kabhi-main-kabhi-tum",
    title: "Kabhi Main Kabhi Tum",
    channel: "Hum TV",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Comedy", "Family"],
    status: "completed",
    totalEpisodes: 32,
    synopsis:
      "A light-hearted romantic comedy about two very different personalities — Mustafa and Sharjeena — who get married. Their contrasting natures lead to hilarious situations and heartwarming moments as they fall in love.",
    thumbnail: "https://i.ytimg.com/vi/XYMFSH1S5aM/maxresdefault.jpg",
    cast: ["Fahad Mustafa", "Hania Aamir", "Asim Mehmood"],
    ytChannelId: YT_CHANNELS.humTv,
    ytPlaylistId: "",
    year: 2024,
    airDay: "Friday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "jaan-e-jahan",
    title: "Jaan-e-Jahan",
    channel: "Hum TV",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Family"],
    status: "ongoing",
    synopsis:
      "A romantic drama featuring two individuals from different worlds. Shehroze, a billionaire, and Mahpara, a simple girl, are brought together by fate. Their love story is filled with misunderstandings, family conflicts, and emotional moments.",
    thumbnail: "https://i.ytimg.com/vi/nB5CzGLmDqE/maxresdefault.jpg",
    cast: ["Hamza Ali Abbasi", "Ayeza Khan", "Mariam Ansari"],
    ytChannelId: YT_CHANNELS.humTv,
    ytPlaylistId: "",
    year: 2024,
    airDay: "Saturday",
    airTime: "09:00 PM",
    episodes: [],
  },
  {
    slug: "ishq-murshid",
    title: "Ishq Murshid",
    channel: "Hum TV",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Spiritual"],
    status: "completed",
    totalEpisodes: 32,
    synopsis:
      "Ishq Murshid is a story of forbidden love between Shibra, a bright student who earns a scholarship, and Shahmeer, her mysterious benefactor. Their complex relationship evolves from professional to deeply personal in unexpected ways.",
    thumbnail: "https://i.ytimg.com/vi/VFv8OVbP-0c/maxresdefault.jpg",
    cast: ["Bilal Abbas Khan", "Durefishan Saleem", "Ahmed Taha Ghani"],
    ytChannelId: YT_CHANNELS.humTv,
    ytPlaylistId: "",
    year: 2023,
    airDay: "Sunday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "humsafar",
    title: "Humsafar",
    channel: "Hum TV",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Family", "Classic"],
    status: "completed",
    totalEpisodes: 23,
    synopsis:
      "One of Pakistan's most iconic dramas. The story of Khirad and Asher — a couple whose marriage is tested by family conspiracies and misunderstandings. Humsafar set the benchmark for Pakistani drama and remains a timeless classic.",
    thumbnail: "https://i.ytimg.com/vi/G2Jt6v6UZTU/maxresdefault.jpg",
    cast: ["Fawad Khan", "Mahira Khan", "Naveen Waqar"],
    ytChannelId: YT_CHANNELS.humTv,
    ytPlaylistId: "",
    year: 2011,
    airDay: "Saturday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "zindagi-gulzar-hai",
    title: "Zindagi Gulzar Hai",
    channel: "Hum TV",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Social", "Classic"],
    status: "completed",
    totalEpisodes: 26,
    synopsis:
      "A classic Pakistani drama following the story of Kashaf, a hard-working girl from a poor family, and Zaroon, a privileged young man. Their contrasting worlds collide and a beautiful love story emerges. Based on Umera Ahmed's novel.",
    thumbnail: "https://i.ytimg.com/vi/PxhMONJl5QE/maxresdefault.jpg",
    cast: ["Fawad Khan", "Sanam Saeed", "Mehreen Raheel"],
    ytChannelId: YT_CHANNELS.humTv,
    ytPlaylistId: "",
    year: 2013,
    airDay: "Friday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "mann-mayal",
    title: "Mann Mayal",
    channel: "Hum TV",
    category: "Drama",
    language: "Urdu",
    genre: ["Romance", "Social"],
    status: "completed",
    totalEpisodes: 24,
    synopsis:
      "Mann Mayal explores love, sacrifice, and the consequences of societal pressure. The story follows Mannu and Salahuddin whose love is separated by circumstances. A deeply emotional drama about second chances and regret.",
    thumbnail: "https://i.ytimg.com/vi/dKH_WK5N9pY/maxresdefault.jpg",
    cast: ["Maya Ali", "Hamza Ali Abbasi", "Ayesha Omer"],
    ytChannelId: YT_CHANNELS.humTv,
    ytPlaylistId: "",
    year: 2016,
    airDay: "Monday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "angan",
    title: "Angan",
    channel: "ARY",
    category: "Drama",
    language: "Urdu",
    genre: ["Family", "Social"],
    status: "completed",
    totalEpisodes: 52,
    synopsis:
      "Angan is a family drama that portrays the lives and struggles of three sisters. Set against the backdrop of a joint family system, it explores relationships, sacrifice, and the bonds that tie a family together.",
    thumbnail: "https://i.ytimg.com/vi/nXa4t4CKJQM/maxresdefault.jpg",
    cast: ["Sajal Ali", "Ahad Raza Mir", "Mawra Hocane", "Mikaal Zulfiqar"],
    ytChannelId: YT_CHANNELS.ary,
    ytPlaylistId: "",
    year: 2018,
    airDay: "Thursday",
    airTime: "09:00 PM",
    episodes: [],
  },
  {
    slug: "meray-qatil-meray-dildar",
    title: "Meray Qatil Meray Dildar",
    channel: "Geo",
    category: "Drama",
    language: "Urdu",
    genre: ["Thriller", "Romance"],
    status: "ongoing",
    synopsis:
      "A gripping thriller drama that follows a young woman entangled in a dangerous web of love and deceit. When the person she loves turns out to be her biggest threat, she must fight to survive and find the truth.",
    thumbnail: "https://i.ytimg.com/vi/placeholder/maxresdefault.jpg",
    cast: ["Muneeb Butt", "Alizeh Shah", "Asad Siddiqui"],
    ytChannelId: YT_CHANNELS.geoEnt,
    ytPlaylistId: "",
    year: 2025,
    airDay: "Wednesday",
    airTime: "08:00 PM",
    episodes: [],
  },
  {
    slug: "pehchaan",
    title: "Pehchaan",
    channel: "ARY",
    category: "Drama",
    language: "Urdu",
    genre: ["Social", "Family"],
    status: "ongoing",
    synopsis:
      "Pehchaan delves into issues of identity, self-worth, and gender discrimination in Pakistani society. A powerful social drama that raises important questions about the value we place on women in our culture.",
    thumbnail: "https://i.ytimg.com/vi/placeholder2/maxresdefault.jpg",
    cast: ["Sami Khan", "Aamina Sheikh", "Saboor Aly"],
    ytChannelId: YT_CHANNELS.ary,
    ytPlaylistId: "",
    year: 2025,
    airDay: "Tuesday",
    airTime: "09:00 PM",
    episodes: [],
  },
];

export function getDramaBySlug(slug: string): Drama | undefined {
  return DRAMAS.find((d) => d.slug === slug);
}

export function getDramasByChannel(channel: Drama["channel"]): Drama[] {
  return DRAMAS.filter((d) => d.channel === channel);
}

export function getDramasByGenre(genre: string): Drama[] {
  return DRAMAS.filter((d) => d.genre.includes(genre));
}

export function getOngoingDramas(): Drama[] {
  return DRAMAS.filter((d) => d.status === "ongoing");
}

export function getCompletedDramas(): Drama[] {
  return DRAMAS.filter((d) => d.status === "completed");
}

export const DRAMA_GENRES = [
  "Romance", "Family", "Social", "Thriller", "Comedy",
  "Fantasy", "Adventure", "Classic", "Spiritual",
];

export const DRAMA_CHANNELS = ["Geo", "ARY", "Hum TV", "Express"] as const;
