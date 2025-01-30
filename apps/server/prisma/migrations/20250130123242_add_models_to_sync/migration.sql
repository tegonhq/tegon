/*
  Warnings:

  - A unique constraint covering the columns `[email,workspaceId]` on the table `People` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `People` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ModelName" ADD VALUE 'Company';
ALTER TYPE "ModelName" ADD VALUE 'People';
ALTER TYPE "ModelName" ADD VALUE 'Support';

-- DropIndex
DROP INDEX "People_email_companyId_key";

-- AlterTable
ALTER TABLE "People" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "People_email_workspaceId_key" ON "People"("email", "workspaceId");

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
