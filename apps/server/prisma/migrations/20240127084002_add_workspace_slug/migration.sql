/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Workspace_name_key";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");
