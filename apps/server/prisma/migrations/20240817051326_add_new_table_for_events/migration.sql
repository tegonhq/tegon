/*
  Warnings:

  - You are about to drop the `WorkspaceTriggerProject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `IssueComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `LinkedIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'BOT';
ALTER TYPE "Role" ADD VALUE 'AGENT';

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_createdById_fkey";

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "IssueComment" ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "LinkedIssue" ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "TriggerProject" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "WorkspaceTriggerProject";

-- CreateTable
CREATE TABLE "ActionEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "eventType" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "eventData" JSONB,
    "sequenceId" BIGINT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "ActionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionEvent_modelId_eventType_key" ON "ActionEvent"("modelId", "eventType");

-- AddForeignKey
ALTER TABLE "ActionEvent" ADD CONSTRAINT "ActionEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
