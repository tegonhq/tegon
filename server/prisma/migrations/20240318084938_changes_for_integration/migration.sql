/*
  Warnings:

  - You are about to drop the column `installationId` on the `IntegrationAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId,integrationDefinitionId,workspaceId]` on the table `IntegrationAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `integratedById` to the `IntegrationAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `IntegrationDefinition` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `IntegrationDefinition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IntegrationName" AS ENUM ('Github', 'GithubPersonal', 'Slack');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ModelName" ADD VALUE 'IntegrationDefinition';
ALTER TYPE "ModelName" ADD VALUE 'IntegrationAccount';
ALTER TYPE "ModelName" ADD VALUE 'LinkedIssue';

-- AlterEnum
ALTER TYPE "WorkflowCategory" ADD VALUE 'TRIAGE';

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_createdById_fkey";

-- AlterTable
ALTER TABLE "IntegrationAccount" DROP COLUMN "installationId",
ADD COLUMN     "accountId" TEXT,
ADD COLUMN     "integratedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IntegrationDefinition" ADD COLUMN     "workspaceId" TEXT NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "IntegrationName" NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "isBidirectional" BOOLEAN,
ADD COLUMN     "sourceMetadata" JSONB,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "sortOrder" DROP NOT NULL,
ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IssueComment" ADD COLUMN     "sourceMetadata" JSONB,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IssueHistory" ADD COLUMN     "sourceMetaData" JSONB,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UsersOnWorkspaces" ADD COLUMN     "externalAccountMappings" JSONB;

-- CreateTable
CREATE TABLE "LinkedIssue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "source" JSONB,
    "sourceData" JSONB,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "LinkedIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "source" JSONB,
    "sourceData" JSONB,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "LinkedComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkedIssue_url_key" ON "LinkedIssue"("url");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedComment_url_key" ON "LinkedComment"("url");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationAccount_accountId_integrationDefinitionId_worksp_key" ON "IntegrationAccount"("accountId", "integrationDefinitionId", "workspaceId");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedIssue" ADD CONSTRAINT "LinkedIssue_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedComment" ADD CONSTRAINT "LinkedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "IssueComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationDefinition" ADD CONSTRAINT "IntegrationDefinition_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_integratedById_fkey" FOREIGN KEY ("integratedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
