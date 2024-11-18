/*
  Warnings:

  - Added the required column `number` to the `Cycle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cycle" ADD COLUMN     "number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "currentCycle" INTEGER;
