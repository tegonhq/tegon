-- CreateEnum
CREATE TYPE "NotificationActionType" AS ENUM ('IssueAssigned', 'IssueUnAssigned', 'IssueStatusChanged', 'IssuePriorityChanged', 'IssueNewComment', 'IssueBlocks');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "type" "NotificationActionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "issueId" TEXT,
    "actionData" JSONB,
    "createdById" TEXT,
    "sourceMetadata" JSONB,
    "readAt" TIMESTAMP(3),
    "snoozedUntil" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
