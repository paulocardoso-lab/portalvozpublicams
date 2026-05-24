-- CreateEnum (safe: skip if already exists)
DO $$ BEGIN
  CREATE TYPE "AlertType" AS ENUM ('LIVE', 'BREAKING', 'INFO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable: MarketIndicator
CREATE TABLE IF NOT EXISTS "MarketIndicator" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MarketIndicator_pkey" PRIMARY KEY ("key")
);

-- CreateTable: AgendaEvent
CREATE TABLE IF NOT EXISTS "AgendaEvent" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "organ" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AgendaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SiteSetting
CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable: PodcastEpisode
CREATE TABLE IF NOT EXISTS "PodcastEpisode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "embedUrl" TEXT,
    "audioUrl" TEXT,
    "coverImage" TEXT,
    "duration" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PodcastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Alert
CREATE TABLE IF NOT EXISTS "Alert" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "type" "AlertType" NOT NULL DEFAULT 'INFO',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SiteMetric
CREATE TABLE IF NOT EXISTS "SiteMetric" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "visitors" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SiteMetric_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SiteMetric_date_key" ON "SiteMetric"("date");

-- CreateTable: RSSFeed
CREATE TABLE IF NOT EXISTS "RSSFeed" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "targetSectionId" TEXT NOT NULL,
    "autoPublish" BOOLEAN NOT NULL DEFAULT false,
    "lastSync" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RSSFeed_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RSSFeed_url_key" ON "RSSFeed"("url");

ALTER TABLE "RSSFeed" ADD CONSTRAINT "RSSFeed_targetSectionId_fkey"
    FOREIGN KEY ("targetSectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: RSSLog
CREATE TABLE IF NOT EXISTS "RSSLog" (
    "id" TEXT NOT NULL,
    "feedId" TEXT NOT NULL,
    "articleId" TEXT,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RSSLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RSSLog_articleId_key" ON "RSSLog"("articleId");

ALTER TABLE "RSSLog" ADD CONSTRAINT "RSSLog_feedId_fkey"
    FOREIGN KEY ("feedId") REFERENCES "RSSFeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
