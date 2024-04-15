/*
  Warnings:

  - A unique constraint covering the columns `[name,workspaceId]` on the table `Label` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Label_name_workspaceId_key" ON "Label"("name", "workspaceId");
