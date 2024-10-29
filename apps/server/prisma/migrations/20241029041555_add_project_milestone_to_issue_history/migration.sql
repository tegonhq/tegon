-- AlterTable
ALTER TABLE "IssueHistory" ADD COLUMN     "fromMilestoneId" TEXT,
ADD COLUMN     "fromProjectId" TEXT,
ADD COLUMN     "toMilestoneId" TEXT,
ADD COLUMN     "toProjectId" TEXT;
