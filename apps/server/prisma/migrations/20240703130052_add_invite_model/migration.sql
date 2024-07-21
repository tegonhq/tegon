/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'INVITED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "UsersOnWorkspaces" ADD COLUMN     "joinedAt" TIMESTAMP(3),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "emailId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL,
    "teamIds" TEXT[],
    "role" "Role" NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);
