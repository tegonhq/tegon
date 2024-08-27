-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "actionAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "actionsEnabled" BOOLEAN NOT NULL DEFAULT false;
