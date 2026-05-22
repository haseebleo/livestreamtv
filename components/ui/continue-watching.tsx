"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getContinueWatching, removeContinueItem, clearContinueWatching, type ContinueItem } from "@/lib/local-storage";

export function ContinueWatching() {
  const [items, setItems] = useState<ContinueItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getContinueWatching());
  }, []);

  function remove(id: string) {
    removeContinueItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearAll() {
    clearContinueWatching();
    setItems([]);
  }

  if (!mounted || items.length === 0) return null;

  return (
    <section style={{ marginBottom: 40 }}>
      <div className="stream-section-header">
        <h2 className="stream-section-title">Continue Watching</h2>
        <button
          onClick={clearAll}
          style={{ fontSize: 12, color: "#6b7280", background: "none", border: "1px solid #2a2a2a", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}
        >
          Clear All
        </button>
      </div>

      <div className="content-grid">
        {items.map((item) => (
          <div key={item.id} style={{ position: "relative" }}>
            <Link href={item.href} className="content-card">
              <div className="content-card-img">
                {item.posterUrl ? (
                  <Image src={item.posterUrl} alt={item.title} fill style={{ objectFit: "cover" }} sizes="200px" />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#141422", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🎬</div>
                )}

                {/* Progress bar */}
                {item.progress > 0 && (
                  <div className="card-progress-bar">
                    <div className="card-progress-fill" style={{ width: `${Math.min(item.progress, 100)}%` }} />
                  </div>
                )}

                <div className="content-card-overlay">
                  <div className="content-card-play">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="content-card-title">{item.title}</p>
              {item.episode && <p className="content-card-year">Episode {item.episode}</p>}
            </Link>

            {/* Remove × */}
            <button
              onClick={() => remove(item.id)}
              style={{ position: "absolute", top: 7, left: 7, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.75)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, lineHeight: 1 }}
              title="Remove"
              aria-label="Remove from continue watching"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
