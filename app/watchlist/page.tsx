"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from "@/lib/local-storage";

export default function WatchlistPage() {
  const [items, setItems]   = useState<WatchlistItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [sort, setSort]     = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    setMounted(true);
    setItems(getWatchlist());
  }, []);

  function remove(id: string) {
    removeFromWatchlist(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const sorted = [...items].sort((a, b) => {
    if (sort === "newest") return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    if (sort === "oldest") return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    return a.title.localeCompare(b.title);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080810", paddingTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 1rem 5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 6 }}>My Watchlist</h1>
            {mounted && <p style={{ fontSize: 14, color: "#6b7280" }}>{items.length} item{items.length !== 1 ? "s" : ""} saved</p>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["newest", "oldest", "title"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                style={{ padding: "7px 14px", borderRadius: 6, border: sort === s ? "1px solid rgba(229,9,20,0.4)" : "1px solid #2a2a2a", background: sort === s ? "rgba(229,9,20,0.12)" : "rgba(255,255,255,0.04)", color: sort === s ? "#f87171" : "#9ca3af", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {!mounted ? null : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <p style={{ fontSize: 64, marginBottom: 20 }}>📋</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Your watchlist is empty</h2>
            <p style={{ color: "#6b7280", marginBottom: 28, fontSize: 15 }}>Click + Watchlist on any movie or drama page to save it here</p>
            <Link href="/" style={{ background: "#e50914", color: "#fff", padding: "13px 32px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="content-grid">
            {sorted.map((item) => (
              <div key={item.id} style={{ position: "relative" }}>
                <Link href={item.href} className="content-card">
                  <div className="content-card-img">
                    {item.posterUrl ? (
                      <Image src={item.posterUrl} alt={item.title} fill style={{ objectFit: "cover" }} sizes="200px" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#141422", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🎬</div>
                    )}
                    <div className="content-card-badge-hd">HD</div>
                    <div className="content-card-overlay">
                      <div className="content-card-play">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <p className="content-card-title">{item.title}</p>
                  <p className="content-card-year" style={{ textTransform: "capitalize" }}>{item.type}</p>
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => remove(item.id)}
                  style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "rgba(229,9,20,0.85)", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, fontWeight: 700 }}
                  title="Remove from watchlist"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
