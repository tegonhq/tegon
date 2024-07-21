/*
  Warnings:

  - A unique constraint covering the columns `[teamId,preference]` on the table `TeamPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- DropEnum
DROP TYPE "IssueEstimateValues";

-- DropEnum
DROP TYPE "Priorities";

-- CreateIndex
CREATE UNIQUE INDEX "TeamPreference_teamId_preference_key" ON "TeamPreference"("teamId", "preference");
