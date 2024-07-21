/*
  Warnings:

  - Changed the type of `modelName` on the `SyncAction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ModelName" AS ENUM ('Workspace', 'Team', 'TeamPreference', 'Issue', 'Label', 'Workflow', 'Template', 'IssueComment', 'IssueHistory', 'UsersOnWorkspaces');

-- AlterTable
ALTER TABLE "SyncAction" DROP COLUMN "modelName",
ADD COLUMN     "modelName" "ModelName" NOT NULL;
