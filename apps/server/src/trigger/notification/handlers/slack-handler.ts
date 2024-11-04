import { PrismaClient } from '@prisma/client';
import {
  ActionEventPayload,
  ActionTypesEnum,
  IntegrationAccount,
  Issue,
  JsonObject,
  NotificationActionType,
  User,
  Workspace,
} from '@tegonhq/types';
import axios from 'axios';

import { getSlackNotificationData, getUnassingedNotification } from '../utils';

const prisma = new PrismaClient();

export const slackHandler = async (payload: ActionEventPayload) => {
  switch (payload.event) {
    case ActionTypesEnum.ON_CREATE:
    case ActionTypesEnum.ON_UPDATE:
      const {
        notificationData: { userId: createdById, workspaceId },
        notificationType,
        notificationData,
      } = payload;

      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      const { type, actionData, subscriberIds } =
        await getSlackNotificationData(
          prisma,
          notificationType,
          createdById,
          notificationData,
        );

      const createdBy = await prisma.user.findUnique({
        where: { id: createdById },
      });

      const unassignedData = await getUnassingedNotification(
        prisma,
        createdById,
        notificationData,
      );

      if (unassignedData) {
        const integrationAccount = await getSlackIntegrationAccount(
          unassignedData.fromAssigneeId,
        );
        const issueIdentifier = getIssueIdentifier(
          unassignedData.issue,
          workspace,
        );
        await sendSlackMessage(
          integrationAccount,
          `You have been unassigned from issue ${issueIdentifier} by ${createdBy.fullname}`,
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
          const message = getMessage(
            type,
            actionData,
            account.integratedById,
            createdBy,
            workspace,
          );
          if (message) {
            await sendSlackMessage(account, message);
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

function getMessage(
  type: NotificationActionType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionData: Record<string, any>,
  userId: string,
  createdBy: User,
  workspace: Workspace,
) {
  let issue: Issue;
  let issueIdentifier: string;
  switch (type) {
    case NotificationActionType.IssueAssigned:
      issue = actionData.issue;
      return `Issue ${getIssueIdentifier(issue, workspace)} is assigned to ${actionData.userId === userId ? 'you' : createdBy.fullname}`;

    case NotificationActionType.IssueBlocks:
      issue = actionData.issue;
      const issueRelation = actionData.issueRelation;
      return `Issue ${getIssueIdentifier(issue, workspace)} is blocked by this issue ${getIssueIdentifier(issueRelation, workspace)}`;

    case NotificationActionType.IssueNewComment:
      issue = actionData.issueComment.issue;
      issueIdentifier = getIssueIdentifier(issue, workspace);
      return `New comment from ${createdBy.fullname} in ${issueIdentifier} `;

    case NotificationActionType.IssueStatusChanged:
      issue = actionData.issue;
      issueIdentifier = getIssueIdentifier(issue, workspace);
      return `${createdBy.fullname} closed this issue ${issueIdentifier}`;

    default:
      return '';
  }
}

async function sendSlackMessage(
  integrationAccount: IntegrationAccount,
  message: string,
) {
  const integrationConfiguration =
    integrationAccount.integrationConfiguration as JsonObject;
  const apiKey = integrationConfiguration.api_key;

  await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel: integrationAccount.accountId,
      text: message,
      mrkdwn: true,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );
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

function getIssueIdentifier(issue: Issue, workspace: Workspace) {
  return `<https://app.tegon.ai/${workspace.slug}/issue/${issue.team.identifier}-${issue.number}|${issue.team.identifier}-${issue.number}>`;
}
