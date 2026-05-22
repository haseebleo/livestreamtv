"use client";

import { useState } from "react";

export interface VideoServer {
  id: string;
  serverName: string;
  embedUrl: string;
  quality: string;
  lang: string;
}

interface StreamPlayerProps {
  servers: VideoServer[];
  title: string;
  posterUrl?: string | null;
}

function buildEmbedSrc(url: string): string {
  // Google Drive: convert share/view URL to embed
  const gdrive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (gdrive) return `https://drive.google.com/file/d/${gdrive[1]}/preview`;

  // YouTube watch URL → embed
  const ytWatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?rel=0&autoplay=1`;

  // Already an embed URL — return as-is
  return url;
}

function isGoogleDrive(url: string) {
  return url.includes("drive.google.com");
}

export function StreamPlayer({ servers, title, posterUrl }: StreamPlayerProps) {
  const [active, setActive] = useState(servers[0] ?? null);
  const [started, setStarted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  if (servers.length === 0) {
    return (
      <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000", borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span style={{ fontSize: 48 }}>🎬</span>
          <p style={{ color: "#9ca3af", fontSize: 15, fontWeight: 600, textAlign: "center", maxWidth: 320, padding: "0 16px" }}>
            No video source available yet.<br />
            <span style={{ fontSize: 13, color: "#6b7280" }}>Admin can add video links from the panel.</span>
          </p>
        </div>
      </div>
    );
  }

  const src = active ? buildEmbedSrc(active.embedUrl) : "";

  return (
    <div>
      {/* Player */}
      <div
        style={{
          position: "relative",
          paddingBottom: fullscreen ? 0 : "56.25%",
          height: fullscreen ? "100vh" : undefined,
          background: "#000",
          borderRadius: fullscreen ? 0 : 12,
          overflow: "hidden",
        }}
      >
        {!started && posterUrl && (
          <div
            style={{ position: "absolute", inset: 0, cursor: "pointer", zIndex: 5 }}
            onClick={() => setStarted(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posterUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(229,9,20,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(229,9,20,0.5)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}>
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 13, fontWeight: 600 }}>
                Click to Play — {active?.quality} · {active?.lang}
              </p>
            </div>
          </div>
        )}

        {(started || !posterUrl) && active && (
          <iframe
            key={active.id}
            src={`${src}${src.includes("?") ? "&" : "?"}autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            title={title}
            sandbox={isGoogleDrive(active.embedUrl) ? undefined : "allow-scripts allow-same-origin allow-presentation allow-forms"}
          />
        )}

        {/* Fullscreen toggle */}
        <button
          onClick={() => setFullscreen((f) => !f)}
          style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 6, padding: "5px 8px", color: "#fff", cursor: "pointer", fontSize: 12 }}
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {fullscreen ? "✕ Exit" : "⛶ Full"}
        </button>
      </div>

      {/* Server switcher */}
      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          Select Server
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {servers.map((srv) => {
            const isActive = active?.id === srv.id;
            return (
              <button
                key={srv.id}
                onClick={() => { setActive(srv); setStarted(true); }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: isActive ? "1px solid rgba(229,9,20,0.5)" : "1px solid #2a2a2a",
                  background: isActive ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#f87171" : "#9ca3af",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 80,
                }}
              >
                <span>{srv.serverName}</span>
                <span style={{ fontSize: 10, fontWeight: 400, color: isActive ? "#f87171" : "#6b7280" }}>
                  {srv.quality} · {srv.lang}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <p style={{ marginTop: 10, fontSize: 11, color: "#4b5563" }}>
        💡 If a server doesn&apos;t load, try another server above.
      </p>
    </div>
  );
}
