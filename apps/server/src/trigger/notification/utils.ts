import { PrismaClient } from '@prisma/client';
import {
  Issue,
  NotificationActionType,
  NotificationActionTypeEnum,
  NotificationData,
  NotificationEventFrom,
} from '@tegonhq/types';

async function handleIssueAssignment(
  prisma: PrismaClient,
  toAssigneeId: string,
  createdById: string,
  issueId: string,
) {
  if (toAssigneeId && toAssigneeId !== createdById) {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { team: true },
    });
    return {
      type: NotificationActionType.IssueAssigned,
      subscriberIds: [toAssigneeId],
      actionData: { userId: toAssigneeId, issue },
    };
  }
  return null;
}

async function handleStateChange(
  prisma: PrismaClient,
  toStateId: string,
  issue: Issue,
) {
  const state = await prisma.workflow.findUnique({
    where: { id: toStateId },
  });
  if (state.category === 'COMPLETED') {
    return {
      type: NotificationActionType.IssueStatusChanged,
      actionData: { stateId: state.id, issue },
    };
  }
  return null;
}

async function handlePriorityChange(toPriority: number) {
  if (toPriority === 1) {
    return {
      type: NotificationActionType.IssuePriorityChanged,
      actionData: { priorityId: toPriority.toString() },
    };
  }
  return null;
}

export async function getSlackNotificationData(
  prisma: PrismaClient,
  eventType: NotificationEventFrom,
  createdById: string,
  notificationData: NotificationData,
) {
  const {
    issueId,
    toPriority,
    toStateId,
    toAssigneeId,
    issueCommentId,
    issueRelationId,
    subscriberIds: originalSubscriberIds,
  } = notificationData;

  let type: NotificationActionType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actionData: Record<string, any> = {};
  let subscriberIds = originalSubscriberIds;

  let issue: Issue;
  switch (eventType) {
    case NotificationEventFrom.IssueCreated: {
      const result = await handleIssueAssignment(
        prisma,
        toAssigneeId,
        createdById,
        issueId,
      );
      if (result) {
        ({ type, subscriberIds, actionData } = result);
      }
      break;
    }

    case NotificationEventFrom.IssueUpdated: {
      issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { team: true },
      });

      const assignmentResult = await handleIssueAssignment(
        prisma,
        toAssigneeId,
        createdById,
        issueId,
      );
      if (assignmentResult) {
        ({ type, subscriberIds, actionData } = assignmentResult);
      } else if (toStateId) {
        const stateResult = await handleStateChange(prisma, toStateId, issue);
        if (stateResult) {
          ({ type, actionData } = stateResult);
        }
      } else {
        const priorityResult = await handlePriorityChange(toPriority);
        if (priorityResult) {
          ({ type, actionData } = priorityResult);
        }
      }
      break;
    }

    case NotificationEventFrom.NewComment:
      type = NotificationActionType.IssueNewComment;
      const issueComment = await prisma.issueComment.findUnique({
        where: { id: issueCommentId },
        include: { issue: { include: { team: true } } },
      });
      console.log(issueComment);
      actionData = { issueComment };
      break;

    case NotificationEventFrom.IssueBlocks:
      type = NotificationActionType.IssueBlocks;
      issue = await prisma.issue.findUnique({ where: { id: issueId } });
      const issueRelation = await prisma.issue.findUnique({
        where: { id: issueRelationId },
      });
      actionData = { issue, issueRelation };
      break;
    default:
      subscriberIds = [];
  }

  return { type, actionData, subscriberIds };
}

export async function getNotificationCreateData(
  prisma: PrismaClient,
  eventType: NotificationEventFrom,
  createdById: string,
  notificationData: NotificationData,
) {
  const {
    toPriority,
    toStateId,
    fromAssigneeId,
    toAssigneeId,
    issueCommentId,
    issueRelationId,
    subscriberIds: originalSubscriberIds,
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
          notificationData,
          createdById,
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
  prisma: PrismaClient,
  notificationData: NotificationData,
  createdById: string,
) {
  const { issueId, fromAssigneeId, sourceMetadata, workspaceId } =
    notificationData;

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

export async function getUnassingedNotification(
  prisma: PrismaClient,
  createdById: string,
  notificationData: NotificationData,
) {
  const { issueId, fromAssigneeId } = notificationData;
  if (fromAssigneeId && fromAssigneeId !== createdById) {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { team: true },
    });
    return { issue, fromAssigneeId };
  }
  return undefined;
}
