# LiveStreamTV.pk 📡

Pakistan's #1 Sports & Entertainment Hub — Live cricket scores, football standings, and streaming guide for movies & TV shows.

## Features

- 🏏 **Live Cricket Scores** — Ball-by-ball updates from Asia Cup, World Cup, Test Series, T20 leagues
- ⚽ **Football Live Scores** — Premier League, La Liga, Champions League, Bundesliga and 100+ competitions
- 🎬 **Movies Streaming Guide** — Find any movie on Netflix, Disney+, Amazon Prime, HBO Max
- 📺 **TV Shows** — Top-rated shows with streaming platform info
- 📡 **100+ Live TV Channels** — Free global live TV organized by category
- ⚡ **Admin Panel** — Full dashboard with stats, content management, API settings

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **APIs**: TMDB (movies/TV), TheSportsDB (football), CricAPI (cricket)

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Keys Needed (All Free)

| API | URL | Used For |
|-----|-----|---------|
| TMDB | themoviedb.org/settings/api | Movies & TV shows |
| CricAPI | cricapi.com | Live cricket scores |
| Google Analytics | analytics.google.com | Traffic tracking |
| Google AdSense | adsense.google.com | Monetization |

## Admin Panel

Access at `/admin` — Dashboard, Content Manager, Settings with AdSense & SEO checklist.

## AdSense Ready

Ad slot placeholders are already placed in all high-traffic pages. Replace `.ad-slot` divs with your AdSense code after approval.

## Deploy to Vercel

1. Push to GitHub (already done)
2. Go to vercel.com, import this repo
3. Add environment variables from `.env.example`
4. Deploy — done!
