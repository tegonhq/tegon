import { PrismaClient } from '@prisma/client';
import {
  ActionEventPayload,
  ActionTypesEnum,
  IntegrationAccount,
  Issue,
  JsonObject,
  LinkedIssue,
  NotificationActionType,
  User,
  Workspace,
} from '@tegonhq/types';
import axios from 'axios';

import {
  getIssueMetadata,
  getNotificationData,
  getUnassingedNotification,
  IssueMetadata,
} from '../utils';

const prisma = new PrismaClient();

export const slackHandler = async (payload: ActionEventPayload) => {
  switch (payload.event) {
    case ActionTypesEnum.ON_CREATE:
    case ActionTypesEnum.ON_UPDATE:
      const {
        notificationData: { userId: createdById, workspaceId, issueId },
        notificationType,
        notificationData,
      } = payload;

      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      const createdBy = await prisma.user.findUnique({
        where: { id: createdById },
      });

      const linkedIssues = await getLinkedIssues(issueId);
      if (linkedIssues?.length) {
        const { type, actionData } = await getNotificationData(
          prisma,
          notificationType,
          createdById,
          notificationData,
          true,
        );

        if (type === NotificationActionType.IssueStatusChanged) {
          const message = await getMessage(
            type,
            actionData,
            createdById,
            createdBy,
            workspace,
          );
          console.log(message);
          await handleLinkedIssueStatus(linkedIssues, workspaceId, message);
        }
      }

      const { type, actionData, subscriberIds } = await getNotificationData(
        prisma,
        notificationType,
        createdById,
        notificationData,
      );

      const unassignedData = await getUnassingedNotification(
        prisma,
        createdById,
        notificationData,
      );

      if (unassignedData) {
        const integrationAccount = await getSlackIntegrationAccount(
          unassignedData.fromAssigneeId,
        );
        const issueMetadata = await getIssueMetadata(
          prisma,
          unassignedData.issue,
        );
        const messageData = {
          message: `You have been unassigned from issue by ${createdBy.fullname}`,
          assignee: issueMetadata.assignee,
          team: issueMetadata.teamName,
          state: issueMetadata.state,
          tittle: getIssueIdentifier(unassignedData.issue, workspace, true),
          createdAt: unassignedData.issue.updatedAt,
          workspace,
        };
        await sendSlackMessage(
          integrationAccount,
          generateIssueSlackBlocks(messageData),
        );
      }

      if (!subscriberIds.length || !type) {
        return { message: 'No subscribers to notify' };
      }

      const relevantSubscribers = subscriberIds.filter(
        (userId) => userId !== createdById,
      );

      // Fetch all integration accounts in one query
      const integrationAccounts = await prisma.integrationAccount.findMany({
        where: {
          personal: true,
          integrationDefinition: { slug: 'slack' },
          deleted: null,
          integratedById: { in: relevantSubscribers },
        },
        include: { integratedBy: true },
      });

      // Send notifications in parallel
      await Promise.all(
        integrationAccounts.map(async (account) => {
          const message = await getMessage(
            type,
            actionData,
            account.integratedById,
            createdBy,
            workspace,
          );
          if (message) {
            await sendSlackMessage(account, {
              channel: account.accountId,
              ...message,
            });
          }
        }),
      );

      return { message: `Sent messages to all subscribers` };

    default:
      return {
        message: `The event payload type "${payload.event}" is not recognized`,
      };
  }
};

async function getMessage(
  type: NotificationActionType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionData: Record<string, any>,
  userId: string,
  createdBy: User,
  workspace: Workspace,
) {
  let issue: Issue;
  let issueIdentifier: string;
  let issueMetadata: IssueMetadata;
  let messageData: MessageMetadata;
  switch (type) {
    case NotificationActionType.IssueAssigned:
      issue = actionData.issue;
      issueMetadata = await getIssueMetadata(prisma, issue);
      messageData = {
        message: `${createdBy.fullname} assigned an issue to ${actionData.userId === userId ? 'you' : createdBy.fullname}`,
        assignee: issueMetadata.assignee,
        team: issueMetadata.teamName,
        state: issueMetadata.state,
        tittle: getIssueIdentifier(issue, workspace, true),
        createdAt: issue.updatedAt,
        workspace,
      };
      return generateIssueSlackBlocks(messageData);

    case NotificationActionType.IssueBlocks:
      issue = actionData.issue;
      const issueRelation = actionData.issueRelation;
      issueMetadata = await getIssueMetadata(prisma, issue);

      messageData = {
        message: `Issue ${getIssueIdentifier(issue, workspace)} is blocked by this issue ${getIssueIdentifier(issueRelation, workspace, true)}`,
        assignee: issueMetadata.assignee,
        team: issueMetadata.teamName,
        state: issueMetadata.state,
        tittle: getIssueIdentifier(issue, workspace, true),
        createdAt: issue.updatedAt,
        workspace,
      };
      return generateIssueSlackBlocks(messageData);

    case NotificationActionType.IssueNewComment:
      issue = actionData.issueComment.issue;
      issueIdentifier = getIssueIdentifier(issue, workspace, true);
      return {
        text: `New comment from ${createdBy.fullname} in ${issueIdentifier}`,
        attachments: [
          {
            color: '#1A89C5',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${actionData.issueComment.bodyMarkdown}`,
                },
              },
            ],
          },
        ],
      };

    case NotificationActionType.IssueStatusChanged:
      issue = actionData.issue;
      issueMetadata = await getIssueMetadata(prisma, issue);
      messageData = {
        message: `${createdBy.fullname} changed issue status to ${issueMetadata.state}`,
        assignee: issueMetadata.assignee,
        team: issueMetadata.teamName,
        state: issueMetadata.state,
        tittle: getIssueIdentifier(issue, workspace, true),
        createdAt: issue.updatedAt,
        workspace,
      };
      return generateIssueSlackBlocks(messageData);

    default:
      return '';
  }
}

async function sendSlackMessage(
  integrationAccount: IntegrationAccount,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: Record<string, any>,
) {
  const integrationConfiguration =
    integrationAccount.integrationConfiguration as JsonObject;
  const apiKey = integrationConfiguration.api_key;

  await axios.post('https://slack.com/api/chat.postMessage', body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

async function getSlackIntegrationAccount(userId: string) {
  return await prisma.integrationAccount.findFirst({
    where: {
      personal: true,
      integrationDefinition: { slug: 'slack' },
      deleted: null,
      integratedById: userId,
    },
    include: { integratedBy: true },
  });
}

async function handleLinkedIssueStatus(
  linkedIssues: LinkedIssue[],
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slackBlocks: any,
) {
  return await Promise.all(
    linkedIssues.map(async (linkedIssue) => {
      const sourceData = linkedIssue.sourceData as JsonObject;
      const channelId = sourceData.channelId as string;
      const ts = sourceData.parentTs as string;

      const integrationAccount = await prisma.integrationAccount.findFirst({
        where: {
          workspaceId,
          settings: {
            path: ['teamDomain'],
            equals: sourceData.slackTeamDomain,
          },
          deleted: null,
          integrationDefinition: {
            slug: 'slack',
          },
        },
      });

      await sendSlackMessage(integrationAccount, {
        channel: channelId,
        thread_ts: ts,
        ...slackBlocks,
      });
    }),
  );
}

async function getLinkedIssues(issueId: string) {
  return await prisma.linkedIssue.findMany({
    where: {
      issueId,
      sourceData: {
        path: ['type'],
        equals: 'slack',
      },
      deleted: null,
    },
  });
}

function getIssueIdentifier(
  issue: Issue,
  workspace: Workspace,
  title: boolean = false,
) {
  const baseIdentifier = `${issue.team.identifier}-${issue.number}`;
  const displayText = title
    ? `${baseIdentifier} ${issue.title}`
    : baseIdentifier;
  return `<https://app.tegon.ai/${workspace.slug}/issue/${baseIdentifier}|${displayText}>`;
}

interface MessageMetadata {
  tittle: string;
  message: string;
  state?: string;
  assignee?: string;
  project?: string;
  team: string;
  createdAt: string | Date;
  workspace: Workspace;
}

function generateIssueSlackBlocks(metadata: MessageMetadata) {
  return {
    text: metadata.message,
    attachments: [
      {
        color: '#1A89C5',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: metadata.tittle,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*Assignee* ${metadata.assignee}    *State* ${metadata.state}    *Team* ${metadata.team}`,
              },
            ],
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `${metadata.workspace.name} | ${formatDate(metadata.createdAt)}`,
              },
            ],
          },
        ],
      },
    ],
  };
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
