/*
  Warnings:

  - You are about to drop the column `source` on the `LinkedComment` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `LinkedIssue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LinkedComment" DROP COLUMN "source";

-- AlterTable
ALTER TABLE "LinkedIssue" DROP COLUMN "source";
