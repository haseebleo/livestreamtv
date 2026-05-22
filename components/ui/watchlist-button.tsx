"use client";

import { useState, useEffect } from "react";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/local-storage";

interface WatchlistButtonProps {
  id: string;
  title: string;
  posterUrl?: string | null;
  href: string;
  type?: string;
  style?: React.CSSProperties;
}

export function WatchlistButton({ id, title, posterUrl, href, type = "movie", style }: WatchlistButtonProps) {
  const [inList, setInList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInList(isInWatchlist(id));
  }, [id]);

  function toggle() {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    if (inList) {
      removeFromWatchlist(id);
      setInList(false);
    } else {
      addToWatchlist({ id, title, posterUrl: posterUrl ?? null, href, type });
      setInList(true);
    }
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 22px", borderRadius: 8, fontWeight: 700, fontSize: 15,
        cursor: "pointer", transition: "all 0.2s",
        transform: animating ? "scale(0.95)" : "scale(1)",
        background: inList ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.07)",
        border: `1px solid ${inList ? "rgba(16,185,129,0.35)" : "#2a2a2a"}`,
        color: inList ? "#34d399" : "#d1d5db",
        ...style,
      }}
      aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
    >
      {inList ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
          In Watchlist
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>
          Watchlist
        </>
      )}
    </button>
  );
}
