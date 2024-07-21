/*
  Warnings:

  - A unique constraint covering the columns `[issueSuggestionId]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "IssueRelationType" ADD VALUE 'SIMILAR';

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "issueSuggestionId" TEXT;

-- AlterTable
ALTER TABLE "IssueRelation" ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "createdById" DROP NOT NULL;

-- CreateTable
CREATE TABLE "IssueSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "issueId" TEXT NOT NULL,
    "suggestedLabelIds" TEXT[],
    "suggestedAssigneeId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "IssueSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IssueSuggestion_issueId_key" ON "IssueSuggestion"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_issueSuggestionId_key" ON "Issue"("issueSuggestionId");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_issueSuggestionId_fkey" FOREIGN KEY ("issueSuggestionId") REFERENCES "IssueSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
