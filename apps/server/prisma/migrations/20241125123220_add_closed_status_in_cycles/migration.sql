/*
  Warnings:

  - Added the required column `status` to the `Cycle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cycle" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL;
