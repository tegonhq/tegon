/*
  Warnings:

  - Added the required column `description` to the `IntegrationDefinitionV2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntegrationDefinitionV2" ADD COLUMN     "description" TEXT NOT NULL;
