/*
  Warnings:

  - Added the required column `settings` to the `IntegrationAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntegrationAccount" ADD COLUMN     "installationId" TEXT,
ADD COLUMN     "settings" JSONB NOT NULL;
