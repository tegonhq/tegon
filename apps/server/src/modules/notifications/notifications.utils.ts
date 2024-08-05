import {
  NotificationActionType,
  NotificationActionTypeEnum,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  NotificationData,
  NotificationEventFrom,
} from './notifications.interface';

export async function getNotificationCreateData(
  prisma: PrismaService,
  eventType: NotificationEventFrom,
  createdById: string,
  notificationData: NotificationData,
) {
  const {
    issueId,
    toPriority,
    toStateId,
    fromAssigneeId,
    toAssigneeId,
    sourceMetadata,
    issueCommentId,
    issueRelationId,
    subscriberIds: originalSubscriberIds,
    workspaceId,
  } = notificationData;

  let type: NotificationActionType;
  let actionData: Record<string, string> = {};
  let subscriberIds = originalSubscriberIds;

  switch (eventType) {
    case NotificationEventFrom.IssueCreated:
      if (toAssigneeId && toAssigneeId !== createdById) {
        type = NotificationActionType.IssueAssigned;
        subscriberIds = [toAssigneeId];
        actionData = { userId: toAssigneeId };
      }
      break;

    case NotificationEventFrom.IssueUpdated:
      if (fromAssigneeId && fromAssigneeId !== createdById) {
        await createUnassignedNotification(
          prisma,
          fromAssigneeId,
          createdById,
          issueId,
          sourceMetadata,
          workspaceId,
        );
      }

      if (toAssigneeId && toAssigneeId !== createdById) {
        type = NotificationActionType.IssueAssigned;
        subscriberIds = [toAssigneeId];
        actionData = { userId: toAssigneeId };
      } else if (toStateId) {
        const state = await prisma.workflow.findUnique({
          where: { id: toStateId },
        });
        if (state.category === 'COMPLETED') {
          type = NotificationActionType.IssueStatusChanged;
          actionData = { stateId: toStateId };
        }
      } else if (toPriority === 1) {
        type = NotificationActionType.IssuePriorityChanged;
        actionData = { priorityId: toPriority.toString() };
      }
      break;

    case NotificationEventFrom.NewComment:
      type = NotificationActionType.IssueNewComment;
      actionData = { issueCommentId };
      break;
    case NotificationEventFrom.IssueBlocks:
      type = NotificationActionType.IssueBlocks;
      actionData = { issueRelationId };
      break;
    default:
      subscriberIds = [];
  }
  return { type, actionData, subscriberIds };
}

async function createUnassignedNotification(
  prisma: PrismaService,
  fromAssigneeId: string,
  createdById: string,
  issueId: string,
  sourceMetadata: Record<string, string>,
  workspaceId: string,
) {
  await prisma.notification.create({
    data: {
      type: NotificationActionTypeEnum.IssueUnAssigned,
      userId: fromAssigneeId,
      createdById,
      issueId,
      actionData: { userId: fromAssigneeId },
      sourceMetadata,
      workspaceId,
    },
  });
}
