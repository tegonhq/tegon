/*
  Warnings:

  - A unique constraint covering the columns `[name,identifier,workspaceId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_name_identifier_workspaceId_key" ON "Team"("name", "identifier", "workspaceId");
