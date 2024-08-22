/*
  Warnings:

  - Added the required column `status` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('INSTALLED', 'NEEDS_CONFIGURATION', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "status" "ActionStatus" NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL;
