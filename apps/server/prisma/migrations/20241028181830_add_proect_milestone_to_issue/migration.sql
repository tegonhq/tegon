-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "projectMilestoneId" TEXT;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectMilestoneId_fkey" FOREIGN KEY ("projectMilestoneId") REFERENCES "ProjectMilestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
