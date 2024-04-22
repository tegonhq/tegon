-- CreateEnum
CREATE TYPE "AttachmentStatus" AS ENUM ('Pending', 'Failed', 'Uploaded', 'Deleted');

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "attachments" TEXT[];

-- AlterTable
ALTER TABLE "IssueComment" ADD COLUMN     "attachments" TEXT[];

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "fileName" TEXT,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileExt" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" "AttachmentStatus" NOT NULL,
    "sourceMetadata" JSONB,
    "uploadedById" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
