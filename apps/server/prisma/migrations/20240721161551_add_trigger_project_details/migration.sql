-- CreateTable
CREATE TABLE "TriggerProject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "projectSecret" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "TriggerProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceTriggerProject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "triggerProjectId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "WorkspaceTriggerProject_pkey" PRIMARY KEY ("id")
);
