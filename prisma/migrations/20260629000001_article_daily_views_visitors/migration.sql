-- CreateTable
CREATE TABLE "ArticleViewDaily" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleViewDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteVisitorDaily" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteVisitorDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleViewDaily_articleId_date_key" ON "ArticleViewDaily"("articleId", "date");

-- CreateIndex
CREATE INDEX "ArticleViewDaily_date_views_idx" ON "ArticleViewDaily"("date", "views");

-- CreateIndex
CREATE UNIQUE INDEX "SiteVisitorDaily_date_visitorHash_key" ON "SiteVisitorDaily"("date", "visitorHash");

-- CreateIndex
CREATE INDEX "SiteVisitorDaily_date_idx" ON "SiteVisitorDaily"("date");

-- AddForeignKey
ALTER TABLE "ArticleViewDaily" ADD CONSTRAINT "ArticleViewDaily_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
