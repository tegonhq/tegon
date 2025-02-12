/*
  Warnings:

  - You are about to drop the column `isDev` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `triggerVersion` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "isDev",
DROP COLUMN "triggerVersion";
