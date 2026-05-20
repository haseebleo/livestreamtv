"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Search, TrendingUp, Zap } from "lucide-react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }> = [];
    const colors = ["#7C3AED", "#0EA5E9", "#EC4899", "#10B981", "#F59E0B"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.strokeStyle = "#7C3AED";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-hero-gradient opacity-90" style={{ zIndex: 1 }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        zIndex: 1
      }} />

      {/* Content */}
      <div className="relative text-center px-4 max-w-5xl mx-auto" style={{ zIndex: 2 }}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 mb-6">
          <span className="w-2 h-2 bg-red-400 rounded-full live-dot" />
          <span className="text-xs font-bold text-purple-300 tracking-widest uppercase">Pakistan&apos;s #1 Live Sports Hub</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
          <span className="text-white">Watch Every</span>
          <br />
          <span className="gradient-text">Live Match & Show</span>
          <br />
          <span className="text-white">Online</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Live cricket scores, football standings, and the ultimate guide to stream any movie or show on Netflix, Amazon, Disney+ and more.
        </p>

        {/* Search bar */}
        <div className="relative max-w-lg mx-auto mb-10">
          <div className="glass rounded-2xl p-1.5 flex items-center gap-2 neon-purple">
            <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search matches, movies, shows..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none py-2"
            />
            <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap">
              Search
            </button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link href="/cricket" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all hover:scale-105">
            🏏 Live Cricket
          </Link>
          <Link href="/football" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all hover:scale-105">
            ⚽ Football Scores
          </Link>
          <Link href="/movies" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all hover:scale-105">
            🎬 Streaming Guide
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 justify-center">
          {[
            { icon: <Zap className="w-4 h-4" />, value: "50+", label: "Live Matches/Day" },
            { icon: <TrendingUp className="w-4 h-4" />, value: "10K+", label: "Movies & Shows" },
            { icon: "📡", value: "100+", label: "Live TV Channels" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-400">
              <span className="text-purple-400">{stat.icon}</span>
              <span className="font-bold text-white">{stat.value}</span>
              <span className="text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050511] to-transparent" style={{ zIndex: 2 }} />
    </section>
  );
}
