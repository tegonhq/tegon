-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('I', 'U', 'D');

-- CreateTable
CREATE TABLE "SyncAction" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" TIMESTAMP(3),
    "modelName" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "SyncAction_pkey" PRIMARY KEY ("id")
);
