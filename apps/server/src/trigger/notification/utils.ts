import { PrismaClient } from '@prisma/client';
import {
  Issue,
  NotificationActionType,
  NotificationActionTypeEnum,
  NotificationData,
  NotificationEventFrom,
} from '@tegonhq/types';
import { Blockquote } from '@tiptap/extension-blockquote';
import { BulletList } from '@tiptap/extension-bullet-list';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';
import { generateHTML } from '@tiptap/html';
import TurndownService from 'turndown';

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

      let bodyMarkdown = '';
      if (issueComment?.body) {
        bodyMarkdown = await convertTiptapJsonToMarkdown(
          issueComment.body,
          prisma,
        );
      }
      actionData = { issueComment: { ...issueComment, bodyMarkdown } };
      break;

    case NotificationEventFrom.IssueBlocks:
      type = NotificationActionType.IssueBlocks;
      issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { team: true },
      });

      const issueRelation = await prisma.issue.findUnique({
        where: { id: issueRelationId },
        include: { team: true },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertTiptapJsonToHtml(tiptapJson: Record<string, any>) {
  const extensions = [
    Document,
    Text,
    Paragraph,
    Heading,
    Blockquote,
    ListItem,
    OrderedList,
    BulletList,
    TaskList,
    TaskItem,
    Image,
    CodeBlock,
    HardBreak,
    HorizontalRule,
    Link,
    Underline,
  ];
  return generateHTML(tiptapJson, extensions);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertTiptapJsonToMarkdown(
  tiptapJson: string,
  prisma: PrismaClient,
) {
  try {
    const parsedTiptapJson = JSON.parse(tiptapJson);
    let finalJson = parsedTiptapJson;
    if (parsedTiptapJson.hasOwnProperty('json')) {
      finalJson = parsedTiptapJson.json;
    }
    // Replace mentions with @username
    const processedJson = await replaceMentionsWithUsernames(finalJson, prisma);

    const htmlText = convertTiptapJsonToHtml(processedJson);
    const turndownService = new TurndownService();
    return turndownService.turndown(htmlText);
  } catch (e) {
    return '';
  }
}

async function replaceMentionsWithUsernames(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: Record<string, any>,
  prisma: PrismaClient,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any>> {
  const traverse = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node: Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Record<string, any>> => {
    if (node.type === 'mention' && node.attrs?.id) {
      const user = await prisma.user.findUnique({
        where: { id: node.attrs.id },
        select: { fullname: true },
      });

      // Replace mention node with a text node containing @username
      return {
        type: 'text',
        text: user ? `@${user.fullname}` : '@unknown',
      };
    }

    if (node.content && Array.isArray(node.content)) {
      node.content = await Promise.all(node.content.map(traverse));
    }

    return node;
  };

  return await traverse(json);
}
