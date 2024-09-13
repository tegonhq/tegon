/*
  Warnings:

  - You are about to drop the column `cron` on the `Action` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ActionScheduleStatus" AS ENUM ('ACTIVE', 'IN_ACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "cron";

-- CreateTable
CREATE TABLE "ActionSchedule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "cron" TEXT NOT NULL,
    "scheduleId" TEXT,
    "status" "ActionScheduleStatus" NOT NULL,
    "timezone" TEXT,
    "scheduledById" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,

    CONSTRAINT "ActionSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionSchedule_actionId_cron_timezone_key" ON "ActionSchedule"("actionId", "cron", "timezone");

-- AddForeignKey
ALTER TABLE "ActionSchedule" ADD CONSTRAINT "ActionSchedule_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
