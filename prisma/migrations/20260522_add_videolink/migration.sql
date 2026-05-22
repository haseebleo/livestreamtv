-- CreateTable VideoLink
CREATE TABLE IF NOT EXISTS "VideoLink" (
    "id"          TEXT NOT NULL,
    "contentId"   TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "season"      INTEGER NOT NULL DEFAULT 1,
    "episode"     INTEGER NOT NULL DEFAULT 0,
    "serverName"  TEXT NOT NULL DEFAULT 'Server 1',
    "embedUrl"    TEXT NOT NULL,
    "quality"     TEXT NOT NULL DEFAULT 'HD',
    "lang"        TEXT NOT NULL DEFAULT 'Urdu',
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VideoLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VideoLink_contentId_contentType_season_episode_idx"
    ON "VideoLink"("contentId", "contentType", "season", "episode");

-- CreateTable ContentMeta
CREATE TABLE IF NOT EXISTS "ContentMeta" (
    "id"           TEXT NOT NULL,
    "contentId"    TEXT NOT NULL,
    "contentType"  TEXT NOT NULL,
    "title"        TEXT NOT NULL,
    "posterUrl"    TEXT,
    "backdropUrl"  TEXT,
    "year"         INTEGER,
    "genre"        TEXT,
    "synopsis"     TEXT,
    "totalEpisodes" INTEGER,
    "totalSeasons"  INTEGER,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContentMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex unique
CREATE UNIQUE INDEX IF NOT EXISTS "ContentMeta_contentId_key" ON "ContentMeta"("contentId");
