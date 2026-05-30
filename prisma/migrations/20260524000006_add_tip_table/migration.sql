-- CreateEnum (safe: skip if already exists)
DO $$ BEGIN
  CREATE TYPE "TipStatus" AS ENUM ('NEW', 'INVESTIGATING', 'PUBLISHED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable: Tip
CREATE TABLE IF NOT EXISTS "Tip" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "content" TEXT NOT NULL,
  "attachments" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "status" "TipStatus" NOT NULL DEFAULT 'NEW',
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);
