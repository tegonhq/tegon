-- AlterTable
ALTER TABLE "IssueHistory" ADD COLUMN     "fromCycleId" TEXT,
ADD COLUMN     "toCycleId" TEXT;

-- CreateTable
CREATE TABLE "CycleHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "userId" TEXT,
    "cycleId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "fromStateId" TEXT,
    "toStateId" TEXT,
    "fromEstimate" INTEGER,
    "toEstimate" INTEGER,
    "isRemoved" BOOLEAN NOT NULL,

    CONSTRAINT "CycleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "userId" TEXT,
    "projectId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "fromStateId" TEXT,
    "toStateId" TEXT,
    "fromEstimate" INTEGER,
    "toEstimate" INTEGER,
    "isRemoved" BOOLEAN NOT NULL,

    CONSTRAINT "ProjectHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CycleHistory" ADD CONSTRAINT "CycleHistory_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectHistory" ADD CONSTRAINT "ProjectHistory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
