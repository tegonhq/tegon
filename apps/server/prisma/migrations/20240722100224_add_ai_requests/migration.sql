-- CreateTable
CREATE TABLE "AIRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "modelName" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "response" TEXT,
    "llmModel" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AIRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIRequest" ADD CONSTRAINT "AIRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
