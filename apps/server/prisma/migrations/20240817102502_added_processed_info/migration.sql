-- AlterTable
ALTER TABLE "ActionEvent" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedIds" TEXT[];
