"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Tv, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cricket", label: "Cricket", icon: "🏏" },
  { href: "/football", label: "Football", icon: "⚽" },
  { href: "/movies", label: "Movies", icon: "🎬" },
  { href: "/tv-shows", label: "TV Shows", icon: "📺" },
  { href: "/live-tv", label: "Live TV", icon: "📡" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, border-color 0.3s ease",
        background: scrolled ? "rgba(8, 8, 16, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #1e1e2e" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="LiveStreamTV.pk home">
            <div className="relative flex-shrink-0">
              <Tv className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span
                className="live-dot absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black gradient-text tracking-tight">LiveStream</span>
              <span className="text-[10px] font-bold tracking-widest" style={{ color: "rgba(167,139,250,0.6)" }}>
                TV.PK
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: isActive ? "rgba(124,58,237,0.18)" : "transparent",
                    color: isActive ? "#a78bfa" : "#9ca3af",
                    borderBottom: isActive ? "2px solid #7c3aed" : "2px solid transparent",
                  }}
                >
                  {link.icon && <span className="text-sm">{link.icon}</span>}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
              aria-label="Live now"
            >
              <span className="live-dot w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
              <span className="text-xs font-bold text-red-400">LIVE</span>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#9ca3af" }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          style={{
            background: "rgba(8, 8, 16, 0.97)",
            borderTop: "1px solid #1e1e2e",
          }}
          className="md:hidden px-4 py-3 space-y-1"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isActive ? "rgba(124,58,237,0.18)" : "transparent",
                  color: isActive ? "#a78bfa" : "#9ca3af",
                }}
              >
                {link.icon && <span className="text-lg">{link.icon}</span>}
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
}
