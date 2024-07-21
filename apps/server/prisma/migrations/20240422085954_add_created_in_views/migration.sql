/*
  Warnings:

  - Added the required column `createdById` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "View" ADD COLUMN     "createdById" TEXT NOT NULL;
