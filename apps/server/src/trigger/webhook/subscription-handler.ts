import { PrismaClient } from '@prisma/client';
import {
  ActionEventPayload,
  ActionTypesEnum,
  ModelNameEnum,
  WebhookSubscription,
} from '@tegonhq/types';
import axios from 'axios';

import { getEventType } from './utils';

const prisma = new PrismaClient();

export const subscriptionHandler = async (payload: ActionEventPayload) => {
  const { webhook, modelId, type, event, changedData } = payload;

  switch (type) {
    case ModelNameEnum.Issue:
      return await issueHandler(event, webhook, modelId, changedData);

    case ModelNameEnum.IssueComment:
      return await issueCommentHandler(
        event,

        webhook,
        modelId,
        changedData,
      );

    default:
      return { message: 'This event is not handled by webhook' };
  }
};

async function issueHandler(
  event: ActionTypesEnum,
  webhook: WebhookSubscription,
  modelId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changedData: Record<string, any>,
) {
  const issue = await prisma.issue.findUnique({
    where: { id: modelId },
    include: {
      team: true,
      project: true,
      projectMilestone: true,
      cycle: true,
      parent: {
        select: {
          id: true,
          title: true,
          number: true,
          team: { select: { id: true, name: true } },
        },
      },
    },
  });

  const workspace = await prisma.workspace.findUnique({
    where: { id: issue.team.workspaceId },
  });

  const labels = await prisma.label.findMany({
    where: {
      id: {
        in: issue.labelIds,
      },
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });

  const assignee = issue.assigneeId
    ? await prisma.user.findUnique({
        where: {
          id: issue.assigneeId,
        },
        select: {
          id: true,
          fullname: true,
          email: true,
        },
      })
    : null;

  const subscribers = await prisma.user.findMany({
    where: {
      id: {
        in: issue.subscriberIds,
      },
    },
    select: {
      id: true,
      fullname: true,
      email: true,
    },
  });

  const state = await prisma.workflow.findUnique({
    where: { id: issue.stateId },
    select: { id: true, name: true, color: true, category: true },
  });

  const issueData = {
    id: issue.id,
    title: issue.title,
    number: issue.number,
    url: `https://app.tegon.ai/${workspace.slug}/issue/${issue.team.identifier}-${issue.number}`,
    description: issue.description,
    priority: issue.priority,
    dueDate: issue.dueDate,
    estimate: issue.estimate,
    state,
    team: {
      id: issue.team.id,
      name: issue.team.name,
      identifier: issue.team.identifier,
    },
    project: issue.project
      ? {
          id: issue.project.id,
          name: issue.project.name,
          status: issue.project.status,
          startDate: issue.project.startDate,
          endDate: issue.project.endDate,
          leadUserId: issue.project.leadUserId,
          teams: issue.project.teams,
        }
      : null,
    milestone: issue.projectMilestone
      ? {
          id: issue.projectMilestone.id,
          name: issue.projectMilestone.name,
          description: issue.projectMilestone.description,
          endDate: issue.projectMilestone.endDate,
        }
      : null,
    cycle: issue.cycle
      ? {
          id: issue.cycle.id,
          name: issue.cycle.name,
          startDate: issue.cycle.startDate,
          endDate: issue.cycle.endDate,
          closedAt: issue.cycle.closedAt,
          status: issue.cycle.status,
        }
      : null,
    parent: issue.parent
      ? {
          id: issue.parent.id,
          title: issue.parent.title,
          number: issue.parent.number,
          team: issue.parent.team,
        }
      : null,

    labels,
    assignee,
    subscribers,
    attachments: issue.attachments,
  };

  const webhookPayload = {
    type: ModelNameEnum.Issue,
    eventType: getEventType(event),
    issue: issueData,
    ...(event === ActionTypesEnum.ON_UPDATE && changedData && { changedData }),
  };

  console.log(webhookPayload);
  return await axios.post(webhook.url, { ...webhookPayload });
}

async function issueCommentHandler(
  event: ActionTypesEnum,
  webhook: WebhookSubscription,
  modelId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changedData?: Record<string, any>,
) {
  const comment = await prisma.issueComment.findUnique({
    where: { id: modelId },
    include: {
      issue: {
        select: {
          id: true,
          title: true,
          number: true,
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      parent: {
        select: {
          id: true,
          body: true,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: comment.userId },
    select: { id: true, fullname: true, email: true },
  });

  const webhookPayload = {
    type: ModelNameEnum.IssueComment,
    eventType: event,
    comment: {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      issue: {
        id: comment.issue.id,
        title: comment.issue.title,
        number: comment.issue.number,
        team: comment.issue.team,
      },
      user,
      parent: comment.parent
        ? {
            id: comment.parent.id,
            body: comment.parent.body,
          }
        : null,
      attachments: comment.attachments,
    },
    ...(event === ActionTypesEnum.ON_UPDATE && changedData && { changedData }),
  };

  return await axios.post(webhook.url, { ...webhookPayload });
}
