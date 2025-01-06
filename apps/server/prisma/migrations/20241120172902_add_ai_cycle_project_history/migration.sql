/*
  Warnings:

  - You are about to drop the column `isRemoved` on the `CycleHistory` table. All the data in the column will be lost.
  - You are about to drop the column `isRemoved` on the `ProjectHistory` table. All the data in the column will be lost.
  - Added the required column `changeType` to the `CycleHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changeType` to the `ProjectHistory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CycleHistoryChangeType" AS ENUM ('ADDED', 'MOVED', 'UPDATED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ProjectHistoryChangeType" AS ENUM ('ADDED', 'MOVED', 'UPDATED', 'REMOVED');

-- AlterTable
ALTER TABLE "CycleHistory" DROP COLUMN "isRemoved",
ADD COLUMN     "changeType" "CycleHistoryChangeType" NOT NULL;

-- AlterTable
ALTER TABLE "ProjectHistory" DROP COLUMN "isRemoved",
ADD COLUMN     "changeType" "ProjectHistoryChangeType" NOT NULL;

-- AlterTable
ALTER TABLE "UsersOnWorkspaces" ADD COLUMN     "ai" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "CycleHistory" ADD CONSTRAINT "CycleHistory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectHistory" ADD CONSTRAINT "ProjectHistory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
