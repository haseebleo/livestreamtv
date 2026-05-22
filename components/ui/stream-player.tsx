"use client";

import { useState, useEffect, useRef } from "react";

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
  // Google Drive share link → preview embed
  const gdrive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (gdrive) return `https://drive.google.com/file/d/${gdrive[1]}/preview`;

  // YouTube watch URL → embed
  const ytWatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?rel=0&autoplay=1`;

  return url;
}

function isGoogleDrive(url: string) { return url.includes("drive.google.com"); }

export function StreamPlayer({ servers, title, posterUrl }: StreamPlayerProps) {
  const [active, setActive]         = useState<VideoServer | null>(servers[0] ?? null);
  const [started, setStarted]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [reported, setReported]     = useState(false);
  const containerRef                = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      const n = parseInt(e.key);
      if (!isNaN(n) && n >= 1 && n <= servers.length) switchServer(servers[n - 1]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servers, started]);

  // Browser fullscreen sync
  useEffect(() => {
    const onFsChange = () => { if (!document.fullscreenElement) setFullscreen(false); };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setFullscreen(false);
    }
  }

  function switchServer(srv: VideoServer) {
    if (srv.id === active?.id) return;
    setActive(srv);
    setStarted(true);
    setLoading(true);
    setReported(false);
  }

  function play() { setStarted(true); setLoading(true); }

  if (servers.length === 0) {
    return (
      <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000814", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span style={{ fontSize: 52 }}>🎬</span>
          <p style={{ color: "#9ca3af", fontSize: 15, fontWeight: 600, textAlign: "center", maxWidth: 320, padding: "0 16px", lineHeight: 1.6 }}>
            No video source available yet.<br />
            <span style={{ fontSize: 13, color: "#6b7280" }}>Admin can add video links from /admin/videos</span>
          </p>
        </div>
      </div>
    );
  }

  const src = active ? buildEmbedSrc(active.embedUrl) : "";

  return (
    <div ref={containerRef} style={{ background: fullscreen ? "#000" : "transparent" }}>

      {/* ── SERVER TABS (above player, like watch-movies.com.pk) ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#141422", border: "1px solid #1e1e2e", borderRadius: 8, padding: "6px 12px", marginRight: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e50914", display: "inline-block", animation: "livePulse 1.5s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.06em" }}>SERVERS</span>
        </div>

        {servers.map((srv, i) => (
          <button
            key={srv.id}
            onClick={() => switchServer(srv)}
            className={`server-tab${active?.id === srv.id ? " active" : ""}`}
            title={`Press ${i + 1} to switch`}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: active?.id === srv.id ? "#e50914" : "#4b5563", display: "inline-block", flexShrink: 0 }} />
            {srv.serverName}
            {srv.quality && (
              <span style={{ fontSize: 9, background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 3, fontWeight: 600 }}>{srv.quality}</span>
            )}
          </button>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {started && (
            <button
              onClick={() => setReported(true)}
              disabled={reported}
              style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: reported ? "#34d399" : "#6b7280", fontSize: 11, cursor: reported ? "default" : "pointer", whiteSpace: "nowrap" }}
            >
              {reported ? "✓ Reported" : "⚠ Report"}
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: "#6b7280", fontSize: 11, cursor: "pointer" }}
            title="F key"
          >
            {fullscreen ? "✕ Exit" : "⛶ Full"}
          </button>
        </div>
      </div>

      {/* ── PLAYER ── */}
      <div style={{ position: "relative", paddingBottom: fullscreen ? 0 : "56.25%", height: fullscreen ? "calc(100vh - 60px)" : undefined, background: "#000", borderRadius: fullscreen ? 0 : 12, overflow: "hidden" }}>

        {/* Click-to-play poster */}
        {!started && posterUrl && (
          <div style={{ position: "absolute", inset: 0, cursor: "pointer", zIndex: 5 }} onClick={play}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posterUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(229,9,20,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(229,9,20,0.6)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 5 }}><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Click to Play</p>
                <p style={{ color: "#9ca3af", fontSize: 12 }}>{active?.quality} · {active?.lang}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading spinner */}
        {loading && started && (
          <div style={{ position: "absolute", inset: 0, zIndex: 6, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div className="spinner" />
            <p style={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>Loading {active?.serverName}…</p>
          </div>
        )}

        {/* The iframe */}
        {(started || !posterUrl) && active && (
          <iframe
            key={active.id}
            src={`${src}${src.includes("?") ? "&" : "?"}autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            title={title}
            sandbox={isGoogleDrive(active.embedUrl) ? undefined : "allow-scripts allow-same-origin allow-presentation allow-forms allow-popups"}
          />
        )}
      </div>

      {/* ── TIPS ── */}
      <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <p style={{ fontSize: 11, color: "#4b5563" }}>
          💡 <kbd>F</kbd> fullscreen &nbsp;·&nbsp;
          <kbd>1</kbd>–<kbd>{servers.length}</kbd> switch server
        </p>
        {reported && (
          <p style={{ fontSize: 11, color: "#34d399", marginLeft: "auto" }}>
            ✓ Thanks! Try another server above.
          </p>
        )}
      </div>
    </div>
  );
}
