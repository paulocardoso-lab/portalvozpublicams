-- AlterTable Campaign: add targetUrl and weight
ALTER TABLE "Campaign"
  ADD COLUMN IF NOT EXISTS "targetUrl" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "weight"    INTEGER NOT NULL DEFAULT 1;

-- CreateTable AdEvent
CREATE TABLE IF NOT EXISTS "AdEvent" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "campaignId" TEXT NOT NULL,
  "type"       TEXT NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "AdEvent_campaignId_fkey"
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AdEvent_campaignId_createdAt_idx"
  ON "AdEvent"("campaignId", "createdAt");
