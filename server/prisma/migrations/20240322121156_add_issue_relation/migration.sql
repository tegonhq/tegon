/*
  Warnings:

  - You are about to drop the column `relationChanges` on the `IssueHistory` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "IssueRelationType" AS ENUM ('BLOCKS', 'BLOCKED', 'RELATED', 'DUPLICATE', 'DUPLICATE_OF');

-- AlterTable
ALTER TABLE "IssueHistory" DROP COLUMN "relationChanges";

-- CreateTable
CREATE TABLE "IssueRelation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "issueId" TEXT NOT NULL,
    "relatedIssueId" TEXT NOT NULL,
    "type" "IssueRelationType" NOT NULL,
    "createdById" TEXT NOT NULL,
    "deletedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "IssueRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IssueRelation_issueId_relatedIssueId_type_key" ON "IssueRelation"("issueId", "relatedIssueId", "type");
