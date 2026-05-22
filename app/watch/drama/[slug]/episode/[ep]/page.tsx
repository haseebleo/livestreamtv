export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDramaBySlug } from "@/lib/api/dramas";
import { db } from "@/lib/db";
import { StreamPlayer, type VideoServer } from "@/components/ui/stream-player";
import { WatchlistButton } from "@/components/ui/watchlist-button";
import { WatchTracker } from "@/components/ui/watch-tracker";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}): Promise<Metadata> {
  const { slug, ep } = await params;
  const drama = getDramaBySlug(slug);
  if (!drama) return { title: "Watch Episode" };
  return {
    title: `Watch ${drama.title} Episode ${ep} Online Free`,
    description: `Watch ${drama.title} Episode ${ep} online in HD. ${drama.synopsis.slice(0, 120)}`,
    openGraph: {
      title: `${drama.title} Ep ${ep} | LiveStreamTV.pk`,
      description: `Watch ${drama.title} Episode ${ep} online free.`,
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

export default async function WatchDramaEpisodePage({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}) {
  const { slug, ep } = await params;
  const drama = getDramaBySlug(slug);
  if (!drama) notFound();

  const epNum  = parseInt(ep);
  const total  = drama.totalEpisodes ?? 0;
  if (isNaN(epNum) || epNum < 1) notFound();

  // Load stored video links for this episode
  const videoLinks = await db.videoLink.findMany({
    where: { contentId: drama.slug, contentType: "drama", episode: epNum, isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  // If no stored links AND drama has a YouTube playlist, fall back to playlist embed
  const fallbackServers: VideoServer[] = [];
  if (videoLinks.length === 0 && drama.ytPlaylistId) {
    fallbackServers.push({
      id: "yt-playlist",
      serverName: "YouTube",
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${drama.ytPlaylistId}&index=${epNum - 1}&rel=0`,
      quality: "HD",
      lang: "Urdu",
    });
  }

  const servers: VideoServer[] = [
    ...videoLinks.map((v) => ({ id: v.id, serverName: v.serverName, embedUrl: v.embedUrl, quality: v.quality, lang: v.lang })),
    ...fallbackServers,
  ];

  const ch      = CHANNEL_STYLES[drama.channel] ?? CHANNEL_STYLES["Geo"];
  const prevEp  = epNum > 1 ? epNum - 1 : null;
  const nextEp  = total === 0 || epNum < total ? epNum + 1 : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: `${drama.title} Episode ${epNum}`,
    episodeNumber: epNum,
    partOfSeries: { "@type": "TVSeries", name: drama.title, url: `${BASE}/dramas/${slug}` },
    description: drama.synopsis,
    image: drama.thumbnail,
    url: `${BASE}/watch/drama/${slug}/episode/${epNum}`,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", paddingTop: 64 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 1rem 5rem" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#6b7280", marginBottom: 16, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/dramas" style={{ color: "#6b7280", textDecoration: "none" }}>Dramas</Link>
          <span>/</span>
          <Link href={`/dramas/${slug}`} style={{ color: "#6b7280", textDecoration: "none" }}>{drama.title}</Link>
          <span>/</span>
          <span style={{ color: "#9ca3af" }}>Episode {epNum}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "start" }}>

          {/* ── LEFT: Player ── */}
          <div>
            <WatchTracker
              id={`drama_${slug}_ep_${epNum}`}
              title={drama.title}
              posterUrl={drama.thumbnail}
              href={`/watch/drama/${slug}/episode/${epNum}`}
              type="drama"
              episode={epNum}
            />
            <StreamPlayer servers={servers} title={`${drama.title} Ep ${epNum}`} posterUrl={drama.thumbnail} />

            {/* Title + nav */}
            <div style={{ marginTop: 18, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: ch.bg, border: `1px solid ${ch.border}`, color: ch.color }}>{drama.channel}</span>
                {drama.genre.slice(0, 2).map((g) => (
                  <span key={g} style={{ fontSize: 11, color: "#9ca3af", background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a2a", borderRadius: 4, padding: "1px 6px" }}>{g}</span>
                ))}
              </div>
              <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
                {drama.title} — Episode {epNum}
              </h1>

              {/* Watchlist button */}
              <div style={{ marginBottom: 14 }}>
                <WatchlistButton
                  id={`drama_${slug}`}
                  title={drama.title}
                  posterUrl={drama.thumbnail}
                  href={`/watch/drama/${slug}/episode/1`}
                  type="drama"
                  style={{ fontSize: 13, padding: "8px 16px" }}
                />
              </div>

              {/* Prev / Next */}
              <div style={{ display: "flex", gap: 10 }}>
                {prevEp && (
                  <Link href={`/watch/drama/${slug}/episode/${prevEp}`}
                    style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid #1e1e2e", color: "#d1d5db", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                    ← Ep {prevEp}
                  </Link>
                )}
                {nextEp && (
                  <Link href={`/watch/drama/${slug}/episode/${nextEp}`}
                    style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                    ▶ Ep {nextEp}
                  </Link>
                )}
              </div>
            </div>

            <div className="ad-slot" style={{ height: 90, marginBottom: 24 }}>Advertisement</div>

            {/* About */}
            <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 18, marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 10 }}>About {drama.title}</h2>
              <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>{drama.synopsis}</p>
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Cast:</span>
                {drama.cast.map((a) => <span key={a} style={{ fontSize: 12, color: "#d1d5db", fontWeight: 600 }}>{a}</span>)}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Episode list ── */}
          <aside>
            <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 16, position: "sticky", top: 80 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 14 }}>All Episodes</h2>
              <div style={{ maxHeight: 480, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                {Array.from({ length: Math.max(total, epNum) }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={`/watch/drama/${slug}/episode/${n}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 8,
                      background: n === epNum ? ch.bg : "transparent",
                      border: n === epNum ? `1px solid ${ch.border}` : "1px solid transparent",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, minWidth: 24, color: n === epNum ? ch.color : "#6b7280" }}>
                      {n}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: n === epNum ? ch.color : "#d1d5db" }}>
                      Episode {n}
                    </span>
                    {n === epNum && <span style={{ marginLeft: "auto", fontSize: 10, color: ch.color }}>▶</span>}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
