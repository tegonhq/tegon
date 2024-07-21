-- CreateEnum
CREATE TYPE "Preference" AS ENUM ('ISSUE_ESTIMATES', 'PRIORITIES');

-- CreateEnum
CREATE TYPE "IssueEstimateValues" AS ENUM ('EXPONENTIAL', 'FIBONACCI', 'LINEAR', 'T_SHIRT');

-- CreateEnum
CREATE TYPE "Priorities" AS ENUM ('NO_PRIORITY_FIRST', 'NO_PRIORITY_LAST');

-- CreateTable
CREATE TABLE "TeamPreference" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" TIMESTAMP(3),
    "teamId" TEXT NOT NULL,
    "preference" "Preference" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TeamPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamPreference" ADD CONSTRAINT "TeamPreference_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
