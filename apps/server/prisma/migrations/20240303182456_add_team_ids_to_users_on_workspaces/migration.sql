/*
  Warnings:

  - The primary key for the `UsersOnWorkspaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `UsersOnTeams` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,workspaceId]` on the table `UsersOnWorkspaces` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `UsersOnWorkspaces` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "UsersOnTeams" DROP CONSTRAINT "UsersOnTeams_teamId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnTeams" DROP CONSTRAINT "UsersOnTeams_userId_fkey";

-- AlterTable
ALTER TABLE "UsersOnWorkspaces" DROP CONSTRAINT "UsersOnWorkspaces_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "teamIds" TEXT[],
ADD CONSTRAINT "UsersOnWorkspaces_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "UsersOnTeams";

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnWorkspaces_userId_workspaceId_key" ON "UsersOnWorkspaces"("userId", "workspaceId");
