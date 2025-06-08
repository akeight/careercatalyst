/*
  Warnings:

  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/

-- Add column first as nullable
ALTER TABLE "Company" ADD COLUMN "userId" TEXT;

-- Backfill userId for existing companies
UPDATE "Company"
SET "userId" = 'clxyz1234abcd5678efgh'; -- replace with real user ID

-- Now make it required
ALTER TABLE "Company"
ALTER COLUMN "userId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
