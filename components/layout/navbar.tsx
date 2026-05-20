"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Tv, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark shadow-lg shadow-purple-900/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Tv className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full live-dot" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black gradient-text tracking-tight">LiveStream</span>
              <span className="text-[10px] font-bold text-purple-400/70 tracking-widest">TV.PK</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
              <span className="w-2 h-2 bg-red-400 rounded-full live-dot" />
              <span className="text-xs font-bold text-red-400">LIVE</span>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Zap className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass-dark border-t border-purple-900/20 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold"
          >
            <Zap className="w-4 h-4" />
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
}
