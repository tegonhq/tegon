-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('I', 'U', 'D');

-- AlterTable
ALTER TABLE "Label" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TeamPreference" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Workflow" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SyncAction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "modelName" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "sequenceId" INTEGER NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "SyncAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncAction_modelId_action_key" ON "SyncAction"("modelId", "action");

-- AddForeignKey
ALTER TABLE "SyncAction" ADD CONSTRAINT "SyncAction_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
