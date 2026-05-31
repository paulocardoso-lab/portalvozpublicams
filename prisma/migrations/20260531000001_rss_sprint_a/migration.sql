-- Sprint A: enriquecimento do importador RSS

-- 1. Novos campos em RSSFeed
ALTER TABLE "RSSFeed"
  ADD COLUMN IF NOT EXISTS "syncIntervalHours"   INTEGER   NOT NULL DEFAULT 6,
  ADD COLUMN IF NOT EXISTS "maxItemsPerSync"      INTEGER   NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS "keywordFilter"        TEXT[]    NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "consecutiveFailures"  INTEGER   NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "disabledAt"           TIMESTAMP(3);

-- 2. Enum tipado para status de log
DO $$ BEGIN
  CREATE TYPE "RSSLogStatus" AS ENUM ('SUCCESS', 'FAILED', 'PARTIAL', 'SKIPPED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Migrar coluna status de TEXT para enum (preserva dados existentes)
ALTER TABLE "RSSLog"
  ADD COLUMN IF NOT EXISTS "status_new" "RSSLogStatus";

UPDATE "RSSLog"
  SET "status_new" = CASE
    WHEN "status" = 'SUCCESS' THEN 'SUCCESS'::"RSSLogStatus"
    WHEN "status" = 'FAILED'  THEN 'FAILED'::"RSSLogStatus"
    WHEN "status" = 'SKIPPED' THEN 'SKIPPED'::"RSSLogStatus"
    ELSE 'FAILED'::"RSSLogStatus"
  END;

ALTER TABLE "RSSLog" DROP COLUMN "status";
ALTER TABLE "RSSLog" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "RSSLog" ALTER COLUMN "status" SET NOT NULL;

-- 4. Novos campos de métricas em RSSLog
ALTER TABLE "RSSLog"
  ADD COLUMN IF NOT EXISTS "itemsTotal"   INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "itemsCreated" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "itemsSkipped" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "itemsFailed"  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "durationMs"   INTEGER NOT NULL DEFAULT 0;
