/*
  Warnings:

  - You are about to drop the column `userId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Workflow` table. All the data in the column will be lost.
  - Added the required column `category` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkflowCategory" AS ENUM ('BACKLOG', 'UNSTARTED', 'STARTED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('ISSUE', 'PROJECT', 'DOCUMENT');

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_userId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "type",
ADD COLUMN     "category" "TemplateCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "type",
ADD COLUMN     "category" "WorkflowCategory" NOT NULL;

-- CreateTable
CREATE TABLE "UsersOnTeams" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "UsersOnTeams_pkey" PRIMARY KEY ("userId","teamId")
);

-- AddForeignKey
ALTER TABLE "UsersOnTeams" ADD CONSTRAINT "UsersOnTeams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnTeams" ADD CONSTRAINT "UsersOnTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
