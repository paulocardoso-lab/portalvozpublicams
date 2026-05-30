-- CreateEnum (safe: skip if already exists)
DO $$ BEGIN
  CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXPIRED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Normalize any legacy text values before changing the column type.
UPDATE "Campaign"
SET "status" = 'ACTIVE'
WHERE "status" NOT IN ('ACTIVE', 'PAUSED', 'EXPIRED', 'ARCHIVED');

-- Change the existing column to the enum type.
ALTER TABLE "Campaign"
ALTER COLUMN "status" TYPE "CampaignStatus"
USING status::text::"CampaignStatus";

ALTER TABLE "Campaign"
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
