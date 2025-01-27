import { NotificationActionType, PrismaClient } from '@prisma/client';
import {
  ActionEventPayload,
  ActionTypesEnum,
  Issue,
  JsonObject,
  LinkedIssue,
  User,
} from '@tegonhq/types';
import axios from 'axios';

import { getIssueMetadata, getNotificationData, IssueMetadata } from '../utils';

const prisma = new PrismaClient();

export const whatsappHandler = async (payload: ActionEventPayload) => {
  switch (payload.event) {
    case ActionTypesEnum.ON_CREATE:
    case ActionTypesEnum.ON_UPDATE:
      const {
        notificationData: { userId: createdById, issueId },
        notificationType,
        notificationData,
      } = payload;

      const createdBy = await prisma.user.findUnique({
        where: { id: createdById },
      });

      const linkedIssues = await prisma.linkedIssue.findMany({
        where: { issueId, deleted: null },
      });
      if (linkedIssues?.length) {
        const { type, actionData } = await getNotificationData(
          prisma,
          notificationType,
          createdById,
          notificationData,
          true,
        );

        if (type === NotificationActionType.IssueStatusChanged) {
          const message = await getMessage(type, actionData, createdBy);
          if (message) {
            await handleLinkedIssueStatus(
              linkedIssues,
              actionData.issue,
              message,
            );
          }
        }
      }

      return { message: `Sent WhatsApp messages to linked issues` };

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
  createdBy: User,
) {
  let issue: Issue;
  let issueMetadata: IssueMetadata;
  switch (type) {
    case NotificationActionType.IssueStatusChanged:
      issue = actionData.issue;
      issueMetadata = await getIssueMetadata(prisma, issue);
      if (issueMetadata.stateCagegory === 'COMPLETED') {
        return `${createdBy.fullname} closed this ticket #${issue.number}`;
      }
      return undefined;

    default:
      return '';
  }
}

async function handleLinkedIssueStatus(
  linkedIssues: LinkedIssue[],
  issue: Issue,
  message: string,
) {
  const issueSourcemetadata = issue.sourceMetadata as JsonObject;
  const integrationAccountId = issueSourcemetadata.id as string;
  const integrationAccount = await prisma.integrationAccount.findUnique({
    where: { id: integrationAccountId },
  });

  return await Promise.all(
    linkedIssues.map(async (linkedIssue) => {
      const sourceData = linkedIssue.sourceData as JsonObject;
      const clientId = integrationAccount.accountId;
      const chatId = sourceData.chatId as JsonObject;

      await axios.post(
        `${process.env.SOCKET_SERVER_URL}/messages/broadcast`,
        {
          clientId,
          payload: {
            chatId: chatId._serialized,
            message,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }),
  );
}
