/*
  Warnings:

  - You are about to drop the `IntegrationAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntegrationDefinition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntegrationAccount" DROP CONSTRAINT "IntegrationAccount_integratedById_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationAccount" DROP CONSTRAINT "IntegrationAccount_integrationDefinitionId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationAccount" DROP CONSTRAINT "IntegrationAccount_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationDefinition" DROP CONSTRAINT "IntegrationDefinition_workspaceId_fkey";

-- DropTable
DROP TABLE "IntegrationAccount";

-- DropTable
DROP TABLE "IntegrationDefinition";

-- DropEnum
DROP TYPE "IntegrationName";
