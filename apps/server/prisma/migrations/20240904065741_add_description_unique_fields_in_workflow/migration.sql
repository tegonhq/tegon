/*
  Warnings:

  - A unique constraint covering the columns `[name,teamId]` on the table `Workflow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "descrfiption" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "_ci" ON "Workflow"("name", "teamId");
