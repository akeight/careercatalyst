-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: link applications to a resume
ALTER TABLE "Application" ADD COLUMN "resumeId" TEXT;

-- CreateIndex
CREATE INDEX "Application_resumeId_idx" ON "Application"("resumeId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Data migration: move existing single-resume fields into the new Resume table.
-- Legacy blobs live in the old (public) store, so pathname is left NULL and the
-- stored url is used directly for viewing.
INSERT INTO "Resume" ("id", "userId", "label", "fileName", "url", "pathname", "size", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    "id",
    'Default',
    COALESCE("resumeName", 'Resume.pdf'),
    "resumeUrl",
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "User"
WHERE "resumeUrl" IS NOT NULL;

-- Drop the now-unused single-resume columns.
ALTER TABLE "User" DROP COLUMN "resumeUrl";
ALTER TABLE "User" DROP COLUMN "resumeName";
