-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "gradYear" INTEGER,
ADD COLUMN     "linkedInUrl" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "onboardedAt" TIMESTAMP(3),
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "resumeName" TEXT,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "school" TEXT,
ADD COLUMN     "targetRole" TEXT,
ADD COLUMN     "weeklyGoal" INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
