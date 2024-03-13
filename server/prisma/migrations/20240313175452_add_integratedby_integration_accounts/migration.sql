/*
  Warnings:

  - Added the required column `integratedById` to the `IntegrationAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntegrationAccount" ADD COLUMN     "integratedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_integratedById_fkey" FOREIGN KEY ("integratedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
