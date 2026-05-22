import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livestreamtv.pk";

const TODAY = new Date().toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const DAY   = new Date().toLocaleDateString("en-US", { weekday: "long" }) as keyof typeof SCHEDULE;

export const metadata: Metadata = {
  title: `Pakistani TV Schedule Today — Geo, ARY, Hum TV Dramas Tonight`,
  description: `Today's Pakistani TV schedule. What's on Geo TV, ARY Digital and Hum TV tonight? Drama timings, shows airing today — ${TODAY}.`,
  keywords: [
    "Pakistani TV schedule today", "Geo TV drama schedule",
    "ARY schedule tonight", "Hum TV drama today",
    "what's on Pakistani TV today", "Pakistani drama timings",
    "Geo entertainment schedule", "ARY Digital schedule",
  ],
  openGraph: {
    title: `Pakistani TV Schedule Today | LiveStreamTV.pk`,
    description: `What's on Geo TV, ARY Digital and Hum TV tonight? Full drama schedule for today.`,
    images: [`${BASE}/api/og?title=Pakistani+TV+Schedule+Today&type=live&sub=Geo+TV%2C+ARY%2C+Hum+TV`],
  },
};

interface Show {
  time: string;
  title: string;
  type: "Drama" | "Talk Show" | "News" | "Game Show" | "Religious" | "Telefilm";
  isNew?: boolean;
}

interface ChannelSchedule {
  channel: string;
  color: string;
  bg: string;
  border: string;
  shows: Show[];
}

const SCHEDULE: Record<string, ChannelSchedule[]> = {
  Monday: [
    {
      channel: "Geo Entertainment",
      color: "#34d399", bg: "rgba(0,179,65,0.08)", border: "rgba(0,179,65,0.2)",
      shows: [
        { time: "06:00 AM", title: "Morning Show", type: "Talk Show" },
        { time: "09:00 AM", title: "Religious Program", type: "Religious" },
        { time: "01:00 PM", title: "Afternoon Drama", type: "Drama" },
        { time: "05:00 PM", title: "Family Drama (Repeat)", type: "Drama" },
        { time: "07:00 PM", title: "Geo News Bulletin", type: "News" },
        { time: "08:00 PM", title: "Prime Time Drama", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Late Night Drama", type: "Drama", isNew: true },
        { time: "10:00 PM", title: "Meray Qatil Meray Dildar", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "ARY Digital",
      color: "#f87171", bg: "rgba(229,9,20,0.08)", border: "rgba(229,9,20,0.2)",
      shows: [
        { time: "06:00 AM", title: "Good Morning Pakistan", type: "Talk Show" },
        { time: "10:00 AM", title: "Morning Drama", type: "Drama" },
        { time: "02:00 PM", title: "Afternoon Show", type: "Talk Show" },
        { time: "07:00 PM", title: "ARY News", type: "News" },
        { time: "08:00 PM", title: "Pehchaan", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "ARY Drama", type: "Drama", isNew: true },
        { time: "10:00 PM", title: "Late Night Talk", type: "Talk Show" },
      ],
    },
    {
      channel: "Hum TV",
      color: "#a78bfa", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)",
      shows: [
        { time: "06:00 AM", title: "Morning Show", type: "Talk Show" },
        { time: "08:00 PM", title: "Jaan-e-Jahan", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Prime Drama", type: "Drama", isNew: true },
        { time: "10:00 PM", title: "Drama Repeat", type: "Drama" },
      ],
    },
  ],
  Tuesday: [
    {
      channel: "Geo Entertainment",
      color: "#34d399", bg: "rgba(0,179,65,0.08)", border: "rgba(0,179,65,0.2)",
      shows: [
        { time: "08:00 PM", title: "Prime Time Drama", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Late Night Drama", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "ARY Digital",
      color: "#f87171", bg: "rgba(229,9,20,0.08)", border: "rgba(229,9,20,0.2)",
      shows: [
        { time: "08:00 PM", title: "Pehchaan", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "ARY Drama", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "Hum TV",
      color: "#a78bfa", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)",
      shows: [
        { time: "08:00 PM", title: "Jaan-e-Jahan", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Prime Drama", type: "Drama", isNew: true },
      ],
    },
  ],
  Wednesday: [
    {
      channel: "Geo Entertainment",
      color: "#34d399", bg: "rgba(0,179,65,0.08)", border: "rgba(0,179,65,0.2)",
      shows: [
        { time: "08:00 PM", title: "Prime Time Drama", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Meray Qatil Meray Dildar", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "ARY Digital",
      color: "#f87171", bg: "rgba(229,9,20,0.08)", border: "rgba(229,9,20,0.2)",
      shows: [
        { time: "08:00 PM", title: "ARY Prime Drama", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Comedy Show", type: "Game Show" },
      ],
    },
    {
      channel: "Hum TV",
      color: "#a78bfa", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)",
      shows: [
        { time: "08:00 PM", title: "Drama Serial", type: "Drama", isNew: true },
        { time: "10:00 PM", title: "Hum Repeat", type: "Drama" },
      ],
    },
  ],
  Thursday: [
    {
      channel: "Geo Entertainment",
      color: "#34d399", bg: "rgba(0,179,65,0.08)", border: "rgba(0,179,65,0.2)",
      shows: [
        { time: "08:00 PM", title: "Prime Time Drama", type: "Drama", isNew: true },
        { time: "09:30 PM", title: "Drama Serial", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "ARY Digital",
      color: "#f87171", bg: "rgba(229,9,20,0.08)", border: "rgba(229,9,20,0.2)",
      shows: [
        { time: "08:00 PM", title: "Pehchaan", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "ARY Telefilm", type: "Telefilm" },
      ],
    },
    {
      channel: "Hum TV",
      color: "#a78bfa", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)",
      shows: [
        { time: "08:00 PM", title: "Hum Prime Drama", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Talk Show", type: "Talk Show" },
      ],
    },
  ],
  Friday: [
    {
      channel: "Geo Entertainment",
      color: "#34d399", bg: "rgba(0,179,65,0.08)", border: "rgba(0,179,65,0.2)",
      shows: [
        { time: "12:30 PM", title: "Jummah Special", type: "Religious" },
        { time: "08:00 PM", title: "Friday Drama", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "ARY Digital",
      color: "#f87171", bg: "rgba(229,9,20,0.08)", border: "rgba(229,9,20,0.2)",
      shows: [
        { time: "08:00 PM", title: "Angan", type: "Drama", isNew: true },
        { time: "09:30 PM", title: "ARY Game Show", type: "Game Show" },
      ],
    },
    {
      channel: "Hum TV",
      color: "#a78bfa", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)",
      shows: [
        { time: "08:00 PM", title: "Kabhi Main Kabhi Tum", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "Hum Drama", type: "Drama", isNew: true },
      ],
    },
  ],
  Saturday: [
    {
      channel: "Geo Entertainment",
      color: "#34d399", bg: "rgba(0,179,65,0.08)", border: "rgba(0,179,65,0.2)",
      shows: [
        { time: "08:00 PM", title: "Saturday Drama", type: "Drama", isNew: true },
        { time: "10:00 PM", title: "Late Movie", type: "Telefilm" },
      ],
    },
    {
      channel: "ARY Digital",
      color: "#f87171", bg: "rgba(229,9,20,0.08)", border: "rgba(229,9,20,0.2)",
      shows: [
        { time: "08:00 PM", title: "Mere Humsafar", type: "Drama", isNew: true },
        { time: "09:00 PM", title: "ARY Saturday Drama", type: "Drama", isNew: true },
        { time: "10:00 PM", title: "The Last Word", type: "Talk Show" },
      ],
    },
    {
      channel: "Hum TV",
      color: "#a78bfa", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)",
      shows: [
        { time: "08:00 PM", title: "Jaan-e-Jahan", type: "Drama", isNew: true },
        { time: "09:30 PM", title: "Hum Award Night", type: "Talk Show" },
      ],
    },
  ],
  Sunday: [
    {
      channel: "Geo Entertainment",
      color: "#34d399", bg: "rgba(0,179,65,0.08)", border: "rgba(0,179,65,0.2)",
      shows: [
        { time: "08:00 PM", title: "Hatim (Classic)", type: "Drama" },
        { time: "09:00 PM", title: "Sunday Drama", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "ARY Digital",
      color: "#f87171", bg: "rgba(229,9,20,0.08)", border: "rgba(229,9,20,0.2)",
      shows: [
        { time: "07:00 PM", title: "The Couple Show", type: "Game Show" },
        { time: "09:00 PM", title: "Sunday Drama", type: "Drama", isNew: true },
      ],
    },
    {
      channel: "Hum TV",
      color: "#a78bfa", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)",
      shows: [
        { time: "08:00 PM", title: "Ishq Murshid (Classic)", type: "Drama" },
        { time: "09:00 PM", title: "Hum Sunday Special", type: "Drama", isNew: true },
      ],
    },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  Drama:    "#a78bfa",
  "Talk Show": "#60a5fa",
  News:     "#f87171",
  "Game Show": "#fcd34d",
  Religious:"#34d399",
  Telefilm: "#fb923c",
};

export default function TVSchedulePage() {
  const todaySchedule = SCHEDULE[DAY] ?? SCHEDULE["Monday"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pakistani TV Schedule Today",
    description: "Today's TV schedule for Geo TV, ARY Digital and Hum TV",
    url: `${BASE}/tv-schedule`,
    dateModified: new Date().toISOString(),
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div style={{ position: "relative", padding: "3rem 1rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(96,165,250,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 14 }}>📺</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#fff", marginBottom: 10 }}>
            Pakistani TV Schedule <span style={{ color: "#60a5fa" }}>Today</span>
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 480, margin: "0 auto 8px" }}>
            What&apos;s on Geo TV, ARY Digital &amp; Hum TV tonight — {TODAY}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem 5rem" }}>
        <div className="ad-slot" style={{ height: 90, marginBottom: 40 }}>Advertisement</div>

        {/* Day nav */}
        <div style={{ display: "flex", overflowX: "auto", gap: 8, marginBottom: 40, paddingBottom: 4 }}>
          {Object.keys(SCHEDULE).map((day) => (
            <span
              key={day}
              style={{
                flexShrink: 0,
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                background: day === DAY ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.04)",
                border: day === DAY ? "1px solid rgba(96,165,250,0.35)" : "1px solid #1e1e2e",
                color: day === DAY ? "#60a5fa" : "#9ca3af",
                cursor: "default",
              }}
            >
              {day === DAY ? `📍 ${day}` : day}
            </span>
          ))}
        </div>

        {/* Channel schedules */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {todaySchedule.map((ch) => (
            <div key={ch.channel} style={{ background: ch.bg, border: `1px solid ${ch.border}`, borderRadius: 16, overflow: "hidden" }}>
              {/* Channel header */}
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${ch.border}` }}>
                <h2 style={{ fontSize: 15, fontWeight: 900, color: ch.color }}>{ch.channel}</h2>
              </div>

              <div style={{ padding: "12px 0" }}>
                {ch.shows.map((show, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 18px", borderBottom: i < ch.shows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", minWidth: 60, paddingTop: 2 }}>{show.time}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{show.title}</p>
                        {show.isNew && (
                          <span style={{ fontSize: 9, fontWeight: 700, background: "rgba(229,9,20,0.2)", border: "1px solid rgba(229,9,20,0.4)", color: "#f87171", borderRadius: 4, padding: "1px 5px" }}>NEW</span>
                        )}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: TYPE_COLORS[show.type] ?? "#9ca3af" }}>{show.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ad-slot" style={{ height: 90, margin: "40px 0" }}>Advertisement</div>

        {/* Links */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/dramas" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            🎭 Watch Pakistani Dramas
          </Link>
          <Link href="/live-tv" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            📡 Live TV Channels
          </Link>
        </div>

        {/* SEO content block */}
        <div style={{ marginTop: 48, background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 12 }}>What&apos;s on Pakistani TV Today?</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8 }}>
            Looking for today&apos;s Pakistani TV schedule? LiveStreamTV.pk brings you the complete daily TV lineup for{" "}
            <strong style={{ color: "#34d399" }}>Geo Entertainment</strong>,{" "}
            <strong style={{ color: "#f87171" }}>ARY Digital</strong>, and{" "}
            <strong style={{ color: "#a78bfa" }}>Hum TV</strong> — Pakistan&apos;s top drama channels.
            Find out what dramas are airing tonight, their timings, and watch them online directly on our platform.
            From romantic dramas to game shows and talk shows, we cover the complete Pakistani prime time schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
