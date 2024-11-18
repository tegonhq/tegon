/*
  Warnings:

  - The values [TeamPreference] on the enum `ModelName` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `TeamPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModelName_new" AS ENUM ('Action', 'ActionEntity', 'Attachment', 'AIRequest', 'Emoji', 'IntegrationAccount', 'IntegrationDefinition', 'IntegrationDefinitionV2', 'Invite', 'Issue', 'IssueComment', 'IssueHistory', 'IssueRelation', 'IssueSuggestion', 'Label', 'LinkedComment', 'LinkedIssue', 'Notification', 'Project', 'ProjectMilestone', 'Prompt', 'Reaction', 'SyncAction', 'Team', 'Template', 'TriggerProject', 'User', 'UsersOnWorkspaces', 'View', 'Workflow', 'Workspace', 'WorkspaceTriggerProject');
ALTER TABLE "SyncAction" ALTER COLUMN "modelName" TYPE "ModelName_new" USING ("modelName"::text::"ModelName_new");
ALTER TYPE "ModelName" RENAME TO "ModelName_old";
ALTER TYPE "ModelName_new" RENAME TO "ModelName";
DROP TYPE "ModelName_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "TeamPreference" DROP CONSTRAINT "TeamPreference_teamId_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "preferences" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "TeamPreference";
