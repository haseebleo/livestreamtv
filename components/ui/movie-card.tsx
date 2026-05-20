import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  year?: string;
  href: string;
  streaming?: string[];
}

const streamingColors: Record<string, string> = {
  Netflix: "#dc2626",
  "Disney+": "#1d4ed8",
  "Amazon Prime": "#d97706",
  "HBO Max": "#7e22ce",
  "Paramount+": "#2563eb",
  "Apple TV+": "#374151",
  "BBC iPlayer": "#4b5563",
};

export function MovieCard({ id, title, posterPath, rating, year, href, streaming = [] }: MovieCardProps) {
  return (
    <Link href={href} className="poster-card block" aria-label={`${title}${year ? ` (${year})` : ""}`}>
      {/* Poster */}
      <div
        className="relative overflow-hidden card-shine"
        style={{
          width: 150,
          height: 225,
          borderRadius: 10,
          background: "#1c1c1c",
          border: "1px solid #2a2a2a",
        }}
      >
        {posterPath ? (
          <Image
            src={posterPath}
            alt={title}
            width={150}
            height={225}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            sizes="150px"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              textAlign: "center",
              background: `linear-gradient(135deg, hsl(${(id * 47) % 360} 30% 15%), hsl(${(id * 83) % 360} 30% 10%))`,
            }}
          >
            <span style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">🎬</span>
            <span style={{ color: "#ffffff", fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>
              {title}
            </span>
          </div>
        )}

        {/* Rating badge */}
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            borderRadius: 4,
            padding: "2px 5px",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span style={{ color: "#f5c518", fontSize: 10 }} aria-hidden="true">★</span>
          <span style={{ color: "#ffffff", fontSize: 10, fontWeight: 700 }}>
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Title */}
      <p
        style={{
          marginTop: 8,
          fontSize: 12,
          fontWeight: 600,
          color: "#ffffff",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={title}
      >
        {title}
      </p>

      {/* Year */}
      {year && (
        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{year}</p>
      )}

      {/* Streaming platforms */}
      {streaming.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
          {streaming.slice(0, 2).map((s) => (
            <span
              key={s}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#ffffff",
                background: streamingColors[s] ?? "#374151",
                padding: "2px 5px",
                borderRadius: 3,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
