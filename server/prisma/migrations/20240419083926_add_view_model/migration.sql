-- AlterEnum
ALTER TYPE "ModelName" ADD VALUE 'View';

-- AlterTable
ALTER TABLE "View" ALTER COLUMN "isFavorite" SET DEFAULT false;
