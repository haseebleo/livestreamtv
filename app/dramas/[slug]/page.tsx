import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DRAMAS, getDramaBySlug, type Drama } from "@/lib/api/dramas";

export const revalidate = 86400; // revalidate once per day

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export async function generateStaticParams() {
  return DRAMAS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const drama = getDramaBySlug(slug);
  if (!drama) return { title: "Drama Not Found" };

  const title = `${drama.title} — Watch All Episodes Online`;
  const description = `Watch ${drama.title} on ${drama.channel}. ${drama.synopsis.slice(0, 140)}`;

  return {
    title,
    description,
    keywords: [
      `${drama.title} drama`,
      `${drama.title} all episodes`,
      `${drama.title} ${drama.channel}`,
      `watch ${drama.title} online`,
      `${drama.title} episode 1`,
      `Pakistani drama ${drama.year}`,
      `${drama.channel} drama`,
    ],
    openGraph: {
      title: `${drama.title} | LiveStreamTV.pk`,
      description,
      images: [drama.thumbnail, `${BASE}/api/og?title=${encodeURIComponent(drama.title)}&type=live&sub=${encodeURIComponent(drama.channel + " · " + drama.genre.join(", "))}`],
      type: "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title: `${drama.title} — Watch Online | LiveStreamTV.pk`,
      description,
      images: [drama.thumbnail],
    },
  };
}

const CHANNEL_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "Geo":     { color: "#34d399", bg: "rgba(0,179,65,0.1)",   border: "rgba(0,179,65,0.25)"   },
  "ARY":     { color: "#f87171", bg: "rgba(229,9,20,0.1)",   border: "rgba(229,9,20,0.25)"   },
  "Hum TV":  { color: "#a78bfa", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.25)" },
  "Express": { color: "#fcd34d", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
};

function WatchEmbed({ drama }: { drama: Drama }) {
  // Prefer playlist embed; fall back to channel live stream
  const src = drama.ytPlaylistId
    ? `https://www.youtube.com/embed/videoseries?list=${drama.ytPlaylistId}&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed/live_stream?channel=${drama.ytChannelId}&rel=0&modestbranding=1`;

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000", borderRadius: 12, overflow: "hidden" }}>
      <iframe
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        title={`Watch ${drama.title} online`}
        loading="lazy"
      />
    </div>
  );
}

export default async function DramaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const drama = getDramaBySlug(slug);
  if (!drama) notFound();

  const ch = CHANNEL_STYLES[drama.channel] ?? CHANNEL_STYLES["Geo"];
  const related = DRAMAS.filter((d) => d.slug !== drama.slug && (d.channel === drama.channel || d.genre.some((g) => drama.genre.includes(g)))).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: drama.title,
    description: drama.synopsis,
    inLanguage: "ur",
    genre: drama.genre,
    numberOfEpisodes: drama.totalEpisodes,
    startDate: `${drama.year}-01-01`,
    image: drama.thumbnail,
    url: `${BASE}/dramas/${drama.slug}`,
    actor: drama.cast.map((name) => ({ "@type": "Person", name })),
    productionCompany: { "@type": "Organization", name: drama.channel },
    countryOfOrigin: { "@type": "Country", name: "Pakistan" },
    ...(drama.status === "ongoing"
      ? { eventStatus: "https://schema.org/EventScheduled" }
      : { endDate: `${drama.year}-12-31` }),
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 1rem 0", display: "flex", gap: 8, fontSize: 12, color: "#6b7280" }}>
        <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/dramas" style={{ color: "#6b7280", textDecoration: "none" }}>Dramas</Link>
        <span>/</span>
        <span style={{ color: "#9ca3af" }}>{drama.title}</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 1rem 5rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>

          {/* ── LEFT: Player + info ── */}
          <div>
            <WatchEmbed drama={drama} />

            {/* Title + meta */}
            <div style={{ marginTop: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: ch.bg, border: `1px solid ${ch.border}`, color: ch.color }}>
                  {drama.channel}
                </span>
                {drama.status === "ongoing" && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.3)", color: "#f87171" }}>
                    🔴 On Air
                  </span>
                )}
                {drama.genre.map((g) => (
                  <span key={g} style={{ fontSize: 11, color: "#9ca3af", background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a2a", borderRadius: 4, padding: "2px 8px" }}>{g}</span>
                ))}
              </div>

              <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, color: "#fff", marginBottom: 12, lineHeight: 1.2 }}>
                {drama.title}
              </h1>

              <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.8, marginBottom: 20 }}>
                {drama.synopsis}
              </p>

              {/* Watch Now button */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                <Link
                  href={`/watch/drama/${drama.slug}/episode/1`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#e50914", color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 0 20px rgba(229,9,20,0.35)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  Watch Episode 1
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
                {drama.totalEpisodes && (
                  <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ fontSize: 10, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Episodes</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{drama.totalEpisodes}</p>
                  </div>
                )}
                <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 10, padding: "12px 16px" }}>
                  <p style={{ fontSize: 10, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Year</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{drama.year}</p>
                </div>
                {drama.airDay && (
                  <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ fontSize: 10, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Airs</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{drama.airDay} · {drama.airTime}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Episode list — SEO goldmine */}
            {drama.totalEpisodes && drama.totalEpisodes > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
                  All Episodes — {drama.title}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
                  {Array.from({ length: drama.totalEpisodes }, (_, i) => i + 1).map((ep) => (
                    <Link
                      key={ep}
                      href={`/watch/drama/${drama.slug}/episode/${ep}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#141422",
                        border: "1px solid #1e1e2e",
                        borderRadius: 8,
                        padding: "10px 4px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#d1d5db",
                        textDecoration: "none",
                      }}
                    >
                      Ep {ep}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="ad-slot" style={{ height: 90, marginBottom: 32 }}>Advertisement</div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside>
            {/* Cast */}
            <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Cast</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {drama.cast.map((actor) => (
                  <div key={actor} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      👤
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#d1d5db" }}>{actor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* YouTube channel link */}
            <a
              href={`https://www.youtube.com/channel/${drama.ytChannelId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: 12, padding: 16, textDecoration: "none", marginBottom: 20 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#f87171" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#f87171" }}>Watch on YouTube</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>{drama.channel} Official Channel</p>
              </div>
            </a>

            {/* Related dramas */}
            {related.length > 0 && (
              <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 14 }}>You May Also Like</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {related.map((r) => {
                    const rs = CHANNEL_STYLES[r.channel] ?? CHANNEL_STYLES["Geo"];
                    return (
                      <Link key={r.slug} href={`/dramas/${r.slug}`} style={{ display: "flex", gap: 10, textDecoration: "none" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.thumbnail} alt={r.title} width={60} height={40} style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }} loading="lazy" />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>{r.title}</p>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999, background: rs.bg, border: `1px solid ${rs.border}`, color: rs.color }}>{r.channel}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
