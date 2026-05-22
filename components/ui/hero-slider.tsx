"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroSlide {
  id: string | number;
  title: string;
  overview?: string;
  backdropUrl: string | null;
  posterUrl?: string | null;
  year?: string | number;
  rating?: number;
  genres?: string[];
  quality?: string;
  watchHref: string;
  infoHref?: string;
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, slides.length, next]);

  if (!slides.length) return null;

  const s = slides[current];

  return (
    <section
      style={{ position: "relative", height: "75vh", minHeight: 460, overflow: "hidden", background: "#080810" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop */}
      {s.backdropUrl && (
        <Image
          key={s.id}
          src={s.backdropUrl}
          alt={s.title}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="100vw"
        />
      )}

      {/* Gradients */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,8,16,0.98) 0%, rgba(8,8,16,0.7) 50%, rgba(8,8,16,0.15) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #080810 0%, rgba(8,8,16,0.5) 40%, transparent 100%)" }} />

      {/* Content */}
      <div
        key={String(s.id)}
        className="slide-content"
        style={{ position: "relative", zIndex: 10, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "0 1.5rem 4rem", height: "100%", display: "flex", alignItems: "flex-end", gap: 28 }}
      >
        {/* Poster */}
        {s.posterUrl && (
          <div style={{ flexShrink: 0, width: 150, borderRadius: 10, overflow: "hidden", border: "2px solid rgba(229,9,20,0.35)", boxShadow: "0 8px 40px rgba(0,0,0,0.8)", display: "none" }} className="md:block">
            <Image src={s.posterUrl} alt={s.title} width={150} height={225} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        )}

        {/* Info */}
        <div style={{ maxWidth: 580 }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 4, background: "#e50914", color: "#fff", letterSpacing: "0.1em" }}>FEATURED</span>
            {s.year && <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{s.year}</span>}
            {s.rating && s.rating > 0 && <span style={{ fontSize: 13, color: "#f5c518", fontWeight: 700 }}>★ {s.rating.toFixed(1)}</span>}
            {s.quality && (
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "rgba(22,163,74,0.2)", color: "#4ade80", fontWeight: 700, border: "1px solid rgba(22,163,74,0.3)" }}>{s.quality}</span>
            )}
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.9rem)", fontWeight: 900, color: "#fff", lineHeight: 1.12, marginBottom: 12 }}>{s.title}</h1>

          {s.genres && s.genres.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {s.genres.slice(0, 5).map((g) => (
                <span key={g} style={{ fontSize: 11, color: "#9ca3af", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px" }}>{g}</span>
              ))}
            </div>
          )}

          {s.overview && (
            <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.75, marginBottom: 22, maxWidth: 500 }}>
              {s.overview.slice(0, 190)}…
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href={s.watchHref}
              style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#e50914", color: "#fff", padding: "13px 28px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 0 24px rgba(229,9,20,0.45)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              Watch Now
            </Link>
            {s.infoHref && (
              <Link
                href={s.infoHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", padding: "13px 22px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
              >
                ℹ More Info
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Slide counter + dots */}
      <div style={{ position: "absolute", bottom: 22, right: 24, display: "flex", alignItems: "center", gap: 10, zIndex: 20 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
          {current + 1} / {slides.length}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: i === current ? 22 : 7, height: 7, borderRadius: 4, background: i === current ? "#e50914" : "rgba(255,255,255,0.28)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 42, height: 42, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Previous">‹</button>
          <button onClick={next} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 42, height: 42, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Next">›</button>
        </>
      )}
    </section>
  );
}
