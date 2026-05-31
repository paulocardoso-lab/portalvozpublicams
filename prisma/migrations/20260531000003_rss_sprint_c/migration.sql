-- Sprint C: resiliência do importador RSS

-- Tabela de itens que falharam repetidamente (dead-letter queue)
CREATE TABLE IF NOT EXISTS "RSSDeadLetter" (
  "id"          TEXT         NOT NULL,
  "feedId"      TEXT         NOT NULL,
  "url"         TEXT         NOT NULL,
  "title"       TEXT,
  "attempts"    INTEGER      NOT NULL DEFAULT 0,
  "lastError"   TEXT,
  "resolvedAt"  TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "RSSDeadLetter_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "RSSDeadLetter_feedId_idx" ON "RSSDeadLetter"("feedId");
CREATE UNIQUE INDEX IF NOT EXISTS "RSSDeadLetter_feedId_url_key" ON "RSSDeadLetter"("feedId", "url");

ALTER TABLE "RSSDeadLetter"
  ADD CONSTRAINT "RSSDeadLetter_feedId_fkey"
  FOREIGN KEY ("feedId") REFERENCES "RSSFeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
