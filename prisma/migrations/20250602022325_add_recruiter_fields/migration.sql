-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "recruiterEmail" TEXT,
ADD COLUMN     "recruiterLinkedIn" TEXT,
ADD COLUMN     "recruiterName" TEXT,
ADD COLUMN     "recruiterPhone" TEXT,
ADD COLUMN     "referredByRecruiter" BOOLEAN DEFAULT false;
