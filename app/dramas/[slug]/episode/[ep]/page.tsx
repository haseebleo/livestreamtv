import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DRAMAS, getDramaBySlug } from "@/lib/api/dramas";

export const revalidate = 86400;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export async function generateStaticParams() {
  const paths: { slug: string; ep: string }[] = [];
  for (const drama of DRAMAS) {
    const total = drama.totalEpisodes ?? 0;
    for (let i = 1; i <= total; i++) {
      paths.push({ slug: drama.slug, ep: String(i) });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}): Promise<Metadata> {
  const { slug, ep } = await params;
  const drama = getDramaBySlug(slug);
  if (!drama) return { title: "Episode Not Found" };

  const epNum = parseInt(ep);
  const title = `${drama.title} Episode ${epNum} — Watch Online`;
  const description = `Watch ${drama.title} Episode ${epNum} online. ${drama.title} is a ${drama.genre.join(", ")} drama on ${drama.channel}. ${drama.synopsis.slice(0, 100)}`;

  return {
    title,
    description,
    keywords: [
      `${drama.title} episode ${epNum}`,
      `${drama.title} ep ${epNum}`,
      `watch ${drama.title} episode ${epNum} online`,
      `${drama.title} ${epNum} full episode`,
      `${drama.channel} drama episode ${epNum}`,
      `${drama.title} drama`,
    ],
    openGraph: {
      title: `${drama.title} Ep ${epNum} | LiveStreamTV.pk`,
      description,
      images: [drama.thumbnail],
      type: "video.episode",
    },
    twitter: {
      card: "summary_large_image",
      title,
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

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}) {
  const { slug, ep } = await params;
  const drama = getDramaBySlug(slug);
  if (!drama) notFound();

  const epNum = parseInt(ep);
  const total = drama.totalEpisodes ?? 0;
  if (isNaN(epNum) || epNum < 1 || (total > 0 && epNum > total)) notFound();

  const ch = CHANNEL_STYLES[drama.channel] ?? CHANNEL_STYLES["Geo"];
  const prevEp = epNum > 1 ? epNum - 1 : null;
  const nextEp = total === 0 || epNum < total ? epNum + 1 : null;

  // Embed the playlist starting at this episode index (0-based)
  const embedSrc = drama.ytPlaylistId
    ? `https://www.youtube.com/embed/videoseries?list=${drama.ytPlaylistId}&index=${epNum - 1}&rel=0&modestbranding=1&autoplay=1`
    : `https://www.youtube.com/embed/live_stream?channel=${drama.ytChannelId}&rel=0&modestbranding=1`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: `${drama.title} Episode ${epNum}`,
    episodeNumber: epNum,
    partOfSeries: {
      "@type": "TVSeries",
      name: drama.title,
      url: `${BASE}/dramas/${slug}`,
    },
    description: `Watch ${drama.title} Episode ${epNum} online. A ${drama.genre.join(", ")} drama on ${drama.channel}.`,
    inLanguage: "ur",
    url: `${BASE}/dramas/${slug}/episode/${epNum}`,
    image: drama.thumbnail,
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 1rem 0", display: "flex", gap: 8, fontSize: 12, color: "#6b7280", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/dramas" style={{ color: "#6b7280", textDecoration: "none" }}>Dramas</Link>
        <span>/</span>
        <Link href={`/dramas/${slug}`} style={{ color: "#6b7280", textDecoration: "none" }}>{drama.title}</Link>
        <span>/</span>
        <span style={{ color: "#9ca3af" }}>Episode {epNum}</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 1rem 5rem" }}>

        {/* Player */}
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
          <iframe
            src={embedSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            title={`${drama.title} Episode ${epNum}`}
          />
        </div>

        {/* Title + nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: ch.bg, border: `1px solid ${ch.border}`, color: ch.color }}>{drama.channel}</span>
              <span style={{ fontSize: 11, color: "#6b7280" }}>{drama.genre.join(" · ")}</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: 900, color: "#fff" }}>
              {drama.title} — Episode {epNum}
            </h1>
          </div>

          {/* Prev / Next */}
          <div style={{ display: "flex", gap: 10 }}>
            {prevEp && (
              <Link href={`/dramas/${slug}/episode/${prevEp}`}
                style={{ padding: "9px 18px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#d1d5db", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                ← Ep {prevEp}
              </Link>
            )}
            {nextEp && (
              <Link href={`/dramas/${slug}/episode/${nextEp}`}
                style={{ padding: "9px 18px", borderRadius: 8, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                Ep {nextEp} →
              </Link>
            )}
          </div>
        </div>

        <div className="ad-slot" style={{ height: 90, marginBottom: 32 }}>Advertisement</div>

        {/* Synopsis */}
        <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20, marginBottom: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 10 }}>About {drama.title}</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8 }}>{drama.synopsis}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Cast:</span>
            {drama.cast.map((a) => (
              <span key={a} style={{ fontSize: 12, color: "#d1d5db", fontWeight: 600 }}>{a}</span>
            ))}
          </div>
        </div>

        {/* All episodes grid */}
        {total > 0 && (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 16 }}>All Episodes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 6 }}>
              {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={`/dramas/${slug}/episode/${n}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: n === epNum ? ch.bg : "#141422",
                    border: n === epNum ? `1px solid ${ch.border}` : "1px solid #1e1e2e",
                    borderRadius: 8,
                    padding: "9px 4px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: n === epNum ? ch.color : "#9ca3af",
                    textDecoration: "none",
                  }}
                >
                  {n}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link href={`/dramas/${slug}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ← Back to {drama.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
