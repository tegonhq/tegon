/*
  Warnings:

  - You are about to drop the column `desciption` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT;
