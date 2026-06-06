ALTER TABLE "MarketIndicator"
ADD COLUMN IF NOT EXISTS "label" TEXT,
ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "showInHeader" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "showInMobile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "sourceType" TEXT NOT NULL DEFAULT 'MANUAL',
ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT,
ADD COLUMN IF NOT EXISTS "sourcePath" TEXT,
ADD COLUMN IF NOT EXISTS "sourceHeaders" TEXT,
ADD COLUMN IF NOT EXISTS "sourceRefreshMinutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN IF NOT EXISTS "formatDecimals" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN IF NOT EXISTS "prefix" TEXT,
ADD COLUMN IF NOT EXISTS "suffix" TEXT,
ADD COLUMN IF NOT EXISTS "lastFetchStatus" TEXT,
ADD COLUMN IF NOT EXISTS "lastFetchError" TEXT,
ADD COLUMN IF NOT EXISTS "lastFetchedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "sourceUpdatedAt" TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

INSERT INTO "MarketIndicator" (
  "key",
  "label",
  "value",
  "unit",
  "displayOrder",
  "isActive",
  "showInHeader",
  "showInMobile",
  "sourceType",
  "updatedAt"
) VALUES
  ('usd', 'Dólar Comercial', '5,12', 'R$', 10, true, true, true, 'SYSTEM', CURRENT_TIMESTAMP),
  ('boi', 'Arroba do Boi', '353,80', 'R$/@', 20, true, true, true, 'SYSTEM', CURRENT_TIMESTAMP),
  ('soja', 'Saca da Soja', '122,51', 'R$/sc', 30, true, true, false, 'SYSTEM', CURRENT_TIMESTAMP),
  ('milho', 'Saca do Milho', '65,98', 'R$/sc', 40, true, true, false, 'SYSTEM', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

UPDATE "MarketIndicator"
SET
  "value" = CASE
    WHEN "key" = 'usd' AND COALESCE("value", '') = '' THEN '5,12'
    WHEN "key" = 'boi' AND COALESCE("value", '') = '' THEN '353,80'
    WHEN "key" = 'soja' AND COALESCE("value", '') = '' THEN '122,51'
    WHEN "key" = 'milho' AND COALESCE("value", '') = '' THEN '65,98'
    ELSE "value"
  END,
  "label" = COALESCE(
    "label",
    CASE "key"
      WHEN 'usd' THEN 'Dólar Comercial'
      WHEN 'boi' THEN 'Arroba do Boi'
      WHEN 'soja' THEN 'Saca da Soja'
      WHEN 'milho' THEN 'Saca do Milho'
      WHEN 'trigo' THEN 'Trigo'
      ELSE "key"
    END
  ),
  "displayOrder" = CASE "key"
    WHEN 'usd' THEN 10
    WHEN 'boi' THEN 20
    WHEN 'soja' THEN 30
    WHEN 'milho' THEN 40
    WHEN 'trigo' THEN 50
    ELSE "displayOrder"
  END,
  "showInHeader" = CASE
    WHEN "key" IN ('usd', 'boi', 'soja', 'milho') THEN true
    ELSE "showInHeader"
  END,
  "showInMobile" = CASE
    WHEN "key" IN ('usd', 'boi') THEN true
    ELSE "showInMobile"
  END,
  "sourceType" = CASE
    WHEN "key" IN ('usd', 'boi', 'soja', 'milho', 'trigo') THEN 'SYSTEM'
    ELSE "sourceType"
  END;
