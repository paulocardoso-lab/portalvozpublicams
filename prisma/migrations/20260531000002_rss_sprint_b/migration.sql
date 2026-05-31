-- Sprint B: qualidade de conteúdo RSS

-- 1. Novos campos em RSSFeed
ALTER TABLE "RSSFeed"
  ADD COLUMN IF NOT EXISTS "requiresReview"    BOOLEAN  NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "blacklistKeywords" TEXT[]   NOT NULL DEFAULT ARRAY[]::TEXT[];

-- 2. sourceUrl em Article (link canônico da fonte RSS)
ALTER TABLE "Article"
  ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
