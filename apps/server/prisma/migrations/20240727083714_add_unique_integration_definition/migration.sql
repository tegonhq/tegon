/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,name]` on the table `IntegrationDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IntegrationDefinition_workspaceId_name_key" ON "IntegrationDefinition"("workspaceId", "name");
