-- CreateEnum
CREATE TYPE "EditorialAuditStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "EditorialAudit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scope" TEXT,
    "summary" TEXT NOT NULL,
    "status" "EditorialAuditStatus" NOT NULL DEFAULT 'PLANNED',
    "owner" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "evidenceUrl" TEXT,
    "findings" TEXT,
    "recommendations" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorialAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EditorialAudit_status_dueDate_idx" ON "EditorialAudit"("status", "dueDate");

-- CreateIndex
CREATE INDEX "EditorialAudit_createdAt_idx" ON "EditorialAudit"("createdAt");
