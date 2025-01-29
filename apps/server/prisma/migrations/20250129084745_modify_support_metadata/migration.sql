/*
  Warnings:

  - You are about to drop the column `dueBy` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `slaPriority` on the `Support` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Support" DROP COLUMN "dueBy",
DROP COLUMN "slaPriority",
ADD COLUMN     "actualFrtAt" TIMESTAMP(3),
ADD COLUMN     "nextResponseAt" TIMESTAMP(3),
ADD COLUMN     "slaDueBy" TIMESTAMP(3);
