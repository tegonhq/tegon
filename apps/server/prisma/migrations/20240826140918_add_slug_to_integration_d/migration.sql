/*
  Warnings:

  - Added the required column `triggerVersion` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `IntegrationDefinitionV2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "triggerVersion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IntegrationDefinitionV2" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PersonalAccessToken" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'user';
