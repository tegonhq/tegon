-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "preferences" JSONB,
ALTER COLUMN "actionsEnabled" SET DEFAULT true;
