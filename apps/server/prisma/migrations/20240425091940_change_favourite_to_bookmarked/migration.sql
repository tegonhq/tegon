/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `View` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "View" DROP COLUMN "isFavorite",
ADD COLUMN     "isBookmarked" BOOLEAN NOT NULL DEFAULT false;
