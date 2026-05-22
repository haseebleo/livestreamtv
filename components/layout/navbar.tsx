"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Tv, Zap, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cricket", label: "Cricket", icon: "🏏" },
  { href: "/football", label: "Football", icon: "⚽" },
  { href: "/movies", label: "Movies", icon: "🎬" },
  { href: "/tv-shows", label: "TV Shows", icon: "📺" },
  { href: "/live-tv", label: "Live TV", icon: "📡" },
  { href: "/dramas", label: "Dramas", icon: "🎭" },
  { href: "/pakistani-movies", label: "Pak Movies", icon: "🇵🇰" },
  { href: "/bollywood", label: "Bollywood", icon: "🎬" },
  { href: "/turkish-dramas", label: "Turkish", icon: "🇹🇷" },
  { href: "/tv-schedule", label: "TV Schedule", icon: "📅" },
  { href: "/news", label: "News", icon: "📰" },
  { href: "/standings", label: "Standings", icon: "🏆" },
  { href: "/highlights", label: "Highlights", icon: "🎬" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        background: scrolled ? "rgba(10, 10, 10, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #1e1e1e" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.5)" : "none",
      }}
      aria-label="Main navigation"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* ── LOGO ── */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
            aria-label="LiveStreamTV.pk home"
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Tv style={{ width: 26, height: 26, color: "#e50914" }} aria-hidden="true" />
              <span
                className="live-dot"
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  width: 8,
                  height: 8,
                  background: "#e50914",
                  borderRadius: "50%",
                  display: "block",
                  boxShadow: "0 0 6px rgba(229,9,20,0.8)",
                }}
                aria-hidden="true"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>
                <span style={{ color: "#ffffff" }}>LiveStream</span>
                <span style={{ color: "#e50914" }}>TV</span>
                <span style={{ color: "#ffffff" }}>.pk</span>
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 2 }}>
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    color: isActive ? "#ffffff" : "#b3b3b3",
                    background: isActive ? "rgba(229,9,20,0.12)" : "transparent",
                    borderBottom: isActive ? "2px solid #e50914" : "2px solid transparent",
                  }}
                >
                  {link.icon && <span style={{ fontSize: 13 }} aria-hidden="true">{link.icon}</span>}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 10 }}>
            {/* Search */}
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#1c1c1c",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: 13,
                    padding: "7px 12px",
                    width: 180,
                  }}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", padding: "7px 8px", display: "flex" }}
                  aria-label="Close search"
                >
                  <X style={{ width: 15, height: 15 }} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  background: "transparent",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  color: "#b3b3b3",
                  cursor: "pointer",
                  padding: "7px 10px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                }}
                aria-label="Open search"
              >
                <Search style={{ width: 16, height: 16 }} aria-hidden="true" />
              </button>
            )}

            {/* LIVE badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                background: "rgba(229,9,20,0.12)",
                border: "1px solid rgba(229,9,20,0.3)",
                borderRadius: 999,
              }}
              aria-label="Live content available"
            >
              <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} aria-hidden="true" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f87171" }}>LIVE</span>
            </div>

            {/* Admin */}
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 14px",
                background: "#e50914",
                borderRadius: 6,
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              <Zap style={{ width: 13, height: 13 }} aria-hidden="true" />
              Admin
            </Link>
          </div>

          {/* ── MOBILE BUTTON ── */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{
              background: "transparent",
              border: "none",
              color: "#b3b3b3",
              cursor: "pointer",
              padding: 8,
              borderRadius: 6,
            }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {open && (
        <div
          style={{
            background: "rgba(10,10,10,0.98)",
            borderTop: "1px solid #1e1e1e",
            padding: "12px 1rem 16px",
          }}
        >
          {/* Mobile search */}
          <form action="/search" method="GET" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
              <span style={{ padding: "10px 12px", fontSize: 16 }} aria-hidden="true">🔍</span>
              <input
                type="text"
                name="q"
                placeholder="Search movies, shows..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14, padding: "10px 0" }}
              />
            </div>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    color: isActive ? "#ffffff" : "#b3b3b3",
                    background: isActive ? "rgba(229,9,20,0.12)" : "transparent",
                  }}
                >
                  {link.icon && <span style={{ fontSize: 16 }} aria-hidden="true">{link.icon}</span>}
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 8,
                padding: "10px 16px",
                background: "#e50914",
                borderRadius: 8,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Zap style={{ width: 15, height: 15 }} aria-hidden="true" />
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
