/*
  Warnings:

  - You are about to drop the column `stateId` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "stateId",
ADD COLUMN     "status" TEXT;
