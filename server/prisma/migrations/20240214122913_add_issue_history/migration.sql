/*
  Warnings:

  - You are about to drop the column `assigneeIds` on the `Issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "assigneeIds",
ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "estimate" INTEGER;

-- CreateTable
CREATE TABLE "IssueHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "addedLabelIds" TEXT[],
    "removedLabelIds" TEXT[],
    "fromPriority" INTEGER,
    "toPriority" INTEGER,
    "fromStateId" TEXT,
    "toStateId" TEXT,
    "fromEstimate" INTEGER,
    "toEstimate" INTEGER,
    "fromAssigneeId" TEXT,
    "toAssigneeId" TEXT,
    "fromParentId" TEXT,
    "toParentId" TEXT,
    "relationChanges" JSONB[],

    CONSTRAINT "IssueHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IssueHistory" ADD CONSTRAINT "IssueHistory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
