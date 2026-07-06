-- Reassign any existing PENDING applications to APPLIED before the enum value is dropped.
UPDATE "Application" SET "status" = 'APPLIED' WHERE "status" = 'PENDING';

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'SAVED';
COMMIT;
