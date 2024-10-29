/*
  Warnings:

  - You are about to drop the column `fromMilestoneId` on the `IssueHistory` table. All the data in the column will be lost.
  - You are about to drop the column `toMilestoneId` on the `IssueHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IssueHistory" DROP COLUMN "fromMilestoneId",
DROP COLUMN "toMilestoneId",
ADD COLUMN     "fromProjectMilestoneId" TEXT,
ADD COLUMN     "toProjectMilestoneId" TEXT;
