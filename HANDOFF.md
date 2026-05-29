# Handoff — Link Update System Refactor

## Status
Deployed to production (104.251.209.95) on 2026-05-29.

## Files Changed
- `prisma/schema.prisma` — added `provider` column to `VideoLink` for source tracking.
- `lib/video-link-providers.ts` — **new** provider interface + env-configured embed provider + drama YouTube provider + external API placeholder.
- `scripts/sync-video-links.ts` — **rewritten** into provider-based sync with broken-link checking, drama support, and env-based provider config.
- `package.json` — added `sync:videos:check` script for one-off broken-link checks.
- `HANDOFF.md` — this file.

## How to Run the Cron Manually
```bash
# Full sync (movies + shows + dramas) + broken-link check
npm run sync:videos

# Broken-link check only
npm run sync:videos:check

# Verbose output (add --verbose to either command above)
npx tsx scripts/sync-video-links.ts --verbose
```

## How to Verify Updated Links in DB
```bash
# Open Prisma Studio
npm run db:studio

# Or query via psql / any SQL client:
SELECT "contentId", "contentType", provider, "isActive", "embedUrl"
FROM "VideoLink"
WHERE provider != 'manual'
ORDER BY "updatedAt" DESC;
```

## Env Configuration (add to .env or PM2 env)
```
TMDB_API_KEY=your_tmdb_key

# Optional: configure embed providers via JSON templates.
# If not set, embed provider returns empty links (safe default).
# Placeholders: {tmdbId}, {season}, {episode}
EMBED_MOVIE_TEMPLATES=[{"name":"Server 1","url":"https://example.com/embed/movie/{tmdbId}"}]
EMBED_TV_TEMPLATES=[{"name":"Server 1","url":"https://example.com/embed/tv/{tmdbId}/{season}/{episode}"}]

# Optional: enable external approved provider placeholder
ENABLE_EXTERNAL_PROVIDER=true
VIDEO_LINK_API_URL=https://your-approved-api.example.com

# Optional: broken-link check batch size (default 100)
BROKEN_CHECK_BATCH_SIZE=100
```

## Deployment Notes
- Schema pushed and old `provider = 'auto'` records migrated to `'embed'`.
- App rebuilt and restarted on server via `sudo pm2 restart saleoyepk`.
- Initial broken-link check: **100 checked, 26 marked inactive** (old unauthorized embed URLs).

## How to Restart PM2 (Server)
```bash
sudo pm2 restart saleoyepk
```

## Pending TODOs
- **UI watch pages** still generate inline fallback embeds when DB links are empty. The cron now stores links correctly; removing hardcoded UI fallbacks is a separate frontend task.
- **TV show episode query** — the watch page (`watch/movie/[id]`) does not query `VideoLink` by `season`/`episode` for TV shows. Episode links are stored in DB but not consumed by the UI yet.
- **Configure legal embed providers** — set `EMBED_MOVIE_TEMPLATES` and `EMBED_TV_TEMPLATES` in `.env` to populate active links. Until then, the embed provider returns empty links (safe default) and old unauthorized links remain inactive.
