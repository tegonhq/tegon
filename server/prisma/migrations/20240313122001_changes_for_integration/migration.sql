/*
  Warnings:

  - You are about to drop the column `installationId` on the `IntegrationAccount` table. All the data in the column will be lost.
  - Changed the type of `name` on the `IntegrationDefinition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IntegrationName" AS ENUM ('Github', 'GithubPersonal', 'Slack');

-- AlterEnum
ALTER TYPE "WorkflowCategory" ADD VALUE 'TRIAGE';

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_createdById_fkey";

-- AlterTable
ALTER TABLE "IntegrationAccount" DROP COLUMN "installationId",
ADD COLUMN     "accountId" TEXT;

-- AlterTable
ALTER TABLE "IntegrationDefinition" DROP COLUMN "name",
ADD COLUMN     "name" "IntegrationName" NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IssueComment" ADD COLUMN     "sourceMetadata" JSONB;

-- AlterTable
ALTER TABLE "IssueHistory" ADD COLUMN     "sourceMetaData" JSONB,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UsersOnWorkspaces" ADD COLUMN     "externalAccountMappings" JSONB;

-- CreateTable
CREATE TABLE "LinkedIssues" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "source" JSONB,
    "sourceData" JSONB,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "LinkedIssues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkedIssues_url_key" ON "LinkedIssues"("url");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedIssues" ADD CONSTRAINT "LinkedIssues_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
