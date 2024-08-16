-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ModelName" ADD VALUE 'Action';
ALTER TYPE "ModelName" ADD VALUE 'ActionEntity';
ALTER TYPE "ModelName" ADD VALUE 'Attachment';
ALTER TYPE "ModelName" ADD VALUE 'AIRequest';
ALTER TYPE "ModelName" ADD VALUE 'Emoji';
ALTER TYPE "ModelName" ADD VALUE 'IntegrationDefinitionV2';
ALTER TYPE "ModelName" ADD VALUE 'Invite';
ALTER TYPE "ModelName" ADD VALUE 'LinkedComment';
ALTER TYPE "ModelName" ADD VALUE 'Prompt';
ALTER TYPE "ModelName" ADD VALUE 'Reaction';
ALTER TYPE "ModelName" ADD VALUE 'SyncAction';
ALTER TYPE "ModelName" ADD VALUE 'TriggerProject';
ALTER TYPE "ModelName" ADD VALUE 'User';
ALTER TYPE "ModelName" ADD VALUE 'WorkspaceTriggerProject';
