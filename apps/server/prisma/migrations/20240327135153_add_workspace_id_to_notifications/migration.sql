/*
  Warnings:

  - Added the required column `workspaceId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ModelName" ADD VALUE 'Notification';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "workspaceId" TEXT NOT NULL;
