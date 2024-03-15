-- CreateTable
CREATE TABLE "LinkedComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "source" JSONB,
    "sourceData" JSONB,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "LinkedComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkedComment_url_key" ON "LinkedComment"("url");

-- AddForeignKey
ALTER TABLE "LinkedComment" ADD CONSTRAINT "LinkedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "IssueComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
