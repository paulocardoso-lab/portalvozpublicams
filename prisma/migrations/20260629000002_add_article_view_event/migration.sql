-- CreateTable
CREATE TABLE "ArticleViewEvent" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "referrer" TEXT,
    "device" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleViewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArticleViewEvent_articleId_createdAt_idx" ON "ArticleViewEvent"("articleId", "createdAt");

-- CreateIndex
CREATE INDEX "ArticleViewEvent_createdAt_idx" ON "ArticleViewEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "ArticleViewEvent" ADD CONSTRAINT "ArticleViewEvent_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
