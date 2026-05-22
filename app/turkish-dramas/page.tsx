import type { Metadata } from "next";
import Link from "next/link";
import { getTurkishDramas, POSTER } from "@/lib/api/tmdb";
import { ContentCard } from "@/components/ui/content-card";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page = "1" } = await searchParams;
  const pg = parseInt(page);
  return {
    title: pg > 1
      ? `Turkish Dramas with Urdu Dubbing — Page ${pg} | LiveStreamTV.pk`
      : "Turkish Dramas in Urdu — Watch Online | LiveStreamTV.pk",
    description:
      "Watch Turkish dramas with Urdu dubbing online. Dirilis Ertugrul, Kurulus Osman, Payitaht Abdulhamid, Alparslan and more. Best Turkish series in Urdu.",
    keywords: [
      "Turkish drama Urdu dubbing", "Turkish dramas online", "Ertugrul Urdu",
      "Kurulus Osman Urdu", "Turkish drama in Urdu", "Turkish series Urdu dubbed",
      "watch Turkish drama online", "Alparslan Urdu", "Payitaht Abdulhamid Urdu",
      "Turkish drama Pakistan", "best Turkish dramas",
    ],
    openGraph: {
      title: "Turkish Dramas in Urdu | LiveStreamTV.pk",
      description: "Watch all Turkish dramas with Urdu dubbing — Ertugrul, Kurulus Osman, Payitaht and more.",
      images: [`${BASE}/api/og?title=Turkish+Dramas+Urdu&type=live&sub=Ertugrul%2C+Kurulus+Osman%2C+Payitaht`],
    },
  };
}

// Hardcoded popular Turkish dramas — these are what Pakistani audiences search for
const POPULAR_TURKISH = [
  { title: "Dirilis: Ertugrul", searchQuery: "Ertugrul Ghazi Urdu Dubbed", ytChannelId: "UCmMI1sJqAHmP1KQ0iMxnOJQ", desc: "The story of Ertugrul Ghazi, father of Osman I, founder of the Ottoman Empire." },
  { title: "Kurulus: Osman", searchQuery: "Kurulus Osman Urdu Dubbed", ytChannelId: "UCmMI1sJqAHmP1KQ0iMxnOJQ", desc: "The story of Osman I, the founder of the Ottoman Empire and son of Ertugrul." },
  { title: "Payitaht: Abdulhamid", searchQuery: "Payitaht Abdulhamid Urdu", ytChannelId: "UCmMI1sJqAHmP1KQ0iMxnOJQ", desc: "The life and struggles of Ottoman Sultan Abdulhamid II during the empire's final years." },
  { title: "Alparslan: Büyük Selçuklu", searchQuery: "Alparslan Urdu Dubbed", ytChannelId: "UCmMI1sJqAHmP1KQ0iMxnOJQ", desc: "The story of Alp Arslan, the second Sultan of the Great Seljuk Empire." },
  { title: "Mendirman Jaloliddin", searchQuery: "Mendirman Jaloliddin Urdu", ytChannelId: "UCmMI1sJqAHmP1KQ0iMxnOJQ", desc: "A Uzbek historical drama about Jalaluddin Khwarazmshah." },
  { title: "Barbaroslar", searchQuery: "Barbaroslar Urdu Dubbed", ytChannelId: "UCmMI1sJqAHmP1KQ0iMxnOJQ", desc: "The epic story of Barbaros Hayreddin Pasha and the Ottoman navy." },
];

export default async function TurkishDramasPage({ searchParams }: PageProps) {
  const { page = "1" } = await searchParams;
  const pg = Math.max(1, parseInt(page));
  const { results: shows, totalPages } = await getTurkishDramas(pg);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Turkish Dramas in Urdu",
    description: "Watch Turkish dramas with Urdu dubbing online",
    url: `${BASE}/turkish-dramas`,
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(96,165,250,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 14 }}>🇹🇷</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Turkish Dramas <span style={{ background: "linear-gradient(135deg,#60a5fa,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in Urdu</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 520, margin: "0 auto" }}>
            Watch Ertugrul, Kurulus Osman, Payitaht and all popular Turkish series with Urdu dubbing
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem 5rem" }}>
        <div className="ad-slot" style={{ height: 90, marginBottom: 32 }}>Advertisement</div>

        {/* Most searched Turkish dramas — hardcoded for SEO */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 20 }}>🔥 Most Popular — Urdu Dubbed</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {POPULAR_TURKISH.map((drama) => (
              <div key={drama.title} style={{ background: "#141422", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>🇹🇷</span>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{drama.title}</h3>
                    <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)", color: "#60a5fa", borderRadius: 4, padding: "1px 6px" }}>URDU DUBBED</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, marginBottom: 12 }}>{drama.desc}</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(drama.searchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.25)", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, color: "#f87171" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f87171" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch on YouTube →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* TMDB Turkish shows grid */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 20 }}>📺 All Turkish Series</h2>
          <div className="content-grid">
            {shows.map((show: { id: number; name: string; poster_path: string | null; vote_average: number; first_air_date: string }) => (
              <ContentCard
                key={show.id}
                title={show.name}
                posterUrl={POSTER(show.poster_path)}
                href={`/watch/movie/${show.id}`}
                year={show.first_air_date?.slice(0, 4)}
                rating={show.vote_average}
              />
            ))}
          </div>
        </section>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
          {pg > 1 && <Link href={`/turkish-dramas?page=${pg - 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>← Prev</Link>}
          {[pg - 1, pg, pg + 1, pg + 2].filter((p) => p > 0 && p <= totalPages).map((p) => (
            <Link key={p} href={`/turkish-dramas?page=${p}`} style={{ padding: "8px 14px", background: p === pg ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.06)", border: p === pg ? "1px solid rgba(96,165,250,0.4)" : "1px solid #1e1e2e", color: p === pg ? "#60a5fa" : "#fff", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{p}</Link>
          ))}
          {pg < totalPages && <Link href={`/turkish-dramas?page=${pg + 1}`} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Next →</Link>}
        </div>

        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Turkish Dramas in Urdu Dubbing — Watch Online</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8 }}>
            Turkish dramas have taken Pakistan by storm. From the legendary{" "}
            <strong style={{ color: "#fff" }}>Dirilis: Ertugrul</strong> to{" "}
            <strong style={{ color: "#fff" }}>Kurulus: Osman</strong> and{" "}
            <strong style={{ color: "#fff" }}>Payitaht: Abdulhamid</strong> — we track every popular Turkish series with Urdu dubbing. Find cast information, episode guides, and links to watch Turkish dramas online with Urdu subtitles or dubbing.
          </p>
        </div>
      </div>
    </div>
  );
}
