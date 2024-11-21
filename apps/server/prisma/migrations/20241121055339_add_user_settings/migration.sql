/*
  Warnings:

  - You are about to drop the column `ai` on the `UsersOnWorkspaces` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersOnWorkspaces" DROP COLUMN "ai",
ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}';
