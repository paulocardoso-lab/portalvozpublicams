-- AlterTable: add showInMenu and menuOrder to Section
ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "showInMenu" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "menuOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: add slug and cpf to User (may already exist)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cpf" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_slug_key" ON "User"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "User_cpf_key" ON "User"("cpf");
