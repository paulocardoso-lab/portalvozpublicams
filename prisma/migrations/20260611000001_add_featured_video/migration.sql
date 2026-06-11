-- CreateTable
CREATE TABLE "FeaturedVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "embedUrl" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeaturedVideo_isActive_displayOrder_idx" ON "FeaturedVideo"("isActive", "displayOrder");
