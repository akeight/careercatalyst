-- CreateEnum
CREATE TYPE "RoleFamily" AS ENUM ('SOFTWARE_ENGINEERING', 'FRONTEND_ENGINEERING', 'MOBILE_DEVELOPMENT', 'UX_UI_PRODUCT_DESIGN', 'PRODUCT_MANAGEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "MobileSpecialization" AS ENUM ('IOS', 'ANDROID', 'CROSS_PLATFORM', 'NOT_SPECIFIED');

-- CreateEnum
CREATE TYPE "ResearchLevel" AS ENUM ('NONE', 'SNAPSHOT', 'INTERVIEW_BRIEF');

-- CreateEnum
CREATE TYPE "ResearchRunMode" AS ENUM ('SNAPSHOT', 'INTERVIEW_BRIEF');

-- CreateEnum
CREATE TYPE "ResearchRunStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED');

-- CreateEnum
CREATE TYPE "ResearchRunStage" AS ENUM ('REVIEWING_POSITION', 'IDENTIFYING_COMPANY', 'RESEARCHING_OFFICIAL_SOURCES', 'FINDING_RECENT_DEVELOPMENTS', 'BUILDING_ROLE_INSIGHTS', 'CONNECTING_CANDIDATE_CONTEXT', 'VALIDATING_CITATIONS', 'SAVING_BRIEF');

-- CreateEnum
CREATE TYPE "EvidenceTier" AS ENUM ('PRIMARY', 'CREDIBLE_SECONDARY', 'ANECDOTAL');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "jobDescription" TEXT,
ADD COLUMN "roleFamily" "RoleFamily",
ADD COLUMN "mobileSpecialization" "MobileSpecialization";

-- CreateTable
CREATE TABLE "ApplicationResearch" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "highestLevel" "ResearchLevel" NOT NULL DEFAULT 'NONE',
    "snapshotContent" JSONB,
    "snapshotGeneratedAt" TIMESTAMP(3),
    "snapshotSchemaVersion" TEXT,
    "snapshotExcerpt" TEXT,
    "snapshotSourceCount" INTEGER NOT NULL DEFAULT 0,
    "snapshotStaleReason" TEXT,
    "briefContent" JSONB,
    "briefGeneratedAt" TIMESTAMP(3),
    "briefSchemaVersion" TEXT,
    "promptVersion" TEXT,
    "briefExcerpt" TEXT,
    "briefSourceCount" INTEGER NOT NULL DEFAULT 0,
    "briefStaleReason" TEXT,
    "jobDescriptionHash" TEXT,
    "candidateContext" TEXT,
    "companyDomain" TEXT,
    "companyResolvedName" TEXT,
    "resolutionConfidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationResearchSource" (
    "id" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "normalizedUrl" TEXT NOT NULL,
    "title" TEXT,
    "publisher" TEXT,
    "sourceType" TEXT NOT NULL,
    "evidenceTier" "EvidenceTier" NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excerpt" TEXT,
    "relevanceScore" DOUBLE PRECISION,
    "freshnessScore" DOUBLE PRECISION,
    "collectedAtLevel" "ResearchRunMode" NOT NULL,

    CONSTRAINT "ApplicationResearchSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationResearchRun" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" "ResearchRunMode" NOT NULL,
    "status" "ResearchRunStatus" NOT NULL DEFAULT 'PENDING',
    "stage" "ResearchRunStage",
    "idempotencyKey" TEXT NOT NULL,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "providerMeta" JSONB,
    "usage" JSONB,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationResearchRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationResearch_applicationId_key" ON "ApplicationResearch"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationResearch_userId_idx" ON "ApplicationResearch"("userId");

-- CreateIndex
CREATE INDEX "ApplicationResearchSource_researchId_idx" ON "ApplicationResearchSource"("researchId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationResearchSource_researchId_normalizedUrl_key" ON "ApplicationResearchSource"("researchId", "normalizedUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationResearchRun_idempotencyKey_key" ON "ApplicationResearchRun"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ApplicationResearchRun_applicationId_createdAt_idx" ON "ApplicationResearchRun"("applicationId", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationResearchRun_userId_createdAt_idx" ON "ApplicationResearchRun"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationResearchRun_researchId_createdAt_idx" ON "ApplicationResearchRun"("researchId", "createdAt");

-- AddForeignKey
ALTER TABLE "ApplicationResearch" ADD CONSTRAINT "ApplicationResearch_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationResearch" ADD CONSTRAINT "ApplicationResearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationResearchSource" ADD CONSTRAINT "ApplicationResearchSource_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "ApplicationResearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationResearchRun" ADD CONSTRAINT "ApplicationResearchRun_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationResearchRun" ADD CONSTRAINT "ApplicationResearchRun_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "ApplicationResearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationResearchRun" ADD CONSTRAINT "ApplicationResearchRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
