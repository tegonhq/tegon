/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `IssueRelation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IssueHistory" ADD COLUMN     "relationChanges" JSONB;

-- AlterTable
ALTER TABLE "IssueRelation" DROP COLUMN "deletedAt",
ADD COLUMN     "deleted" TIMESTAMP(3);
