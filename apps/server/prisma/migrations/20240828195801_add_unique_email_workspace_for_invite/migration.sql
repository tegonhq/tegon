/*
  Warnings:

  - A unique constraint covering the columns `[emailId,workspaceId]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invite_emailId_workspaceId_key" ON "Invite"("emailId", "workspaceId");
