-- AlterTable
ALTER TABLE "User" ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "demoExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_isDemo_demoExpiresAt_idx" ON "User"("isDemo", "demoExpiresAt");

-- DropIndex
DROP INDEX IF EXISTS "Company_name_key";

-- AlterTable Company: allow same name per user
CREATE UNIQUE INDEX "Company_userId_name_key" ON "Company"("userId", "name");
CREATE INDEX "Company_userId_idx" ON "Company"("userId");

-- Company -> User cascade
ALTER TABLE "Company" DROP CONSTRAINT IF EXISTS "Company_userId_fkey";
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Contact -> User cascade
ALTER TABLE "Contact" DROP CONSTRAINT IF EXISTS "Contact_userId_fkey";
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Contact -> Company set null
ALTER TABLE "Contact" DROP CONSTRAINT IF EXISTS "Contact_companyId_fkey";
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Contact_userId_idx" ON "Contact"("userId");

-- Application -> User cascade
ALTER TABLE "Application" DROP CONSTRAINT IF EXISTS "Application_userId_fkey";
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Application -> Company cascade
ALTER TABLE "Application" DROP CONSTRAINT IF EXISTS "Application_companyId_fkey";
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Application_userId_idx" ON "Application"("userId");

-- Note -> User cascade
ALTER TABLE "Note" DROP CONSTRAINT IF EXISTS "Note_userId_fkey";
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
