import Link from "next/link";
import Image from "next/image";

interface ContentCardProps {
  title: string;
  posterUrl: string | null;
  href: string;
  year?: string | number;
  rating?: number;
  quality?: string;
  badge?: string;
}

export function ContentCard({ title, posterUrl, href, year, rating, quality = "HD", badge }: ContentCardProps) {
  return (
    <Link href={href} className="content-card" aria-label={`${title}${year ? ` (${year})` : ""}`}>
      <div className="content-card-img">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 400px) 50vw, (max-width: 640px) 33vw, (max-width: 900px) 25vw, (max-width: 1200px) 20vw, 16vw"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #141422, #0d0d1a)", padding: 12, textAlign: "center" }}>
            <span style={{ fontSize: 36, marginBottom: 8 }}>🎬</span>
            <span style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{title}</span>
          </div>
        )}

        <div className="content-card-badge-hd">{quality}</div>

        {rating && rating > 0 ? (
          <div className="content-card-badge-rating">★ {rating.toFixed(1)}</div>
        ) : badge ? (
          <div className="content-card-badge-rating" style={{ color: "#a78bfa" }}>{badge}</div>
        ) : null}

        <div className="content-card-overlay">
          <div className="content-card-play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <p className="content-card-title">{title}</p>
      {year && <p className="content-card-year">{year}</p>}
    </Link>
  );
}

export function ContentCardSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ width: "100%", aspectRatio: "2/3", borderRadius: 8 }} />
      <div className="skeleton" style={{ width: "80%", height: 12, marginTop: 8, borderRadius: 4 }} />
      <div className="skeleton" style={{ width: "50%", height: 10, marginTop: 4, borderRadius: 4 }} />
    </div>
  );
}
