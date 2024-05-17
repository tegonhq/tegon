-- AlterEnum
ALTER TYPE "AttachmentStatus" ADD VALUE 'External';

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "url" TEXT;
