-- AlterTable: add details column to AuditLog
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "details" JSONB;
