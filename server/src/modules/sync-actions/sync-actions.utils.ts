/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { ActionType, ModelName, SyncAction } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

export function convertToActionType(action: string): ActionType {
  switch (action.toLowerCase()) {
    case 'insert':
      return ActionType.I;
    case 'update':
      return ActionType.U;
    case 'delete':
      return ActionType.D;
  }

  return null;
}

export function convertLsnToInt(lsn: string) {
  const [logFileNumber, byteOffset] = lsn.split('/');
  const hexString = logFileNumber + byteOffset;
  return parseInt(hexString, 16);
}

export async function getWorkspaceId(
  prisma: PrismaService,
  modelName: ModelName,
  modelId: string,
): Promise<string> {
  switch (modelName) {
    case ModelName.Workspace:
      return modelId;

    case ModelName.UsersOnWorkspaces:
      const usersOnWorkspace = await prisma.usersOnWorkspaces.findUnique({
        where: { id: modelId },
      });
      return usersOnWorkspace.workspaceId;

    case ModelName.Team:
      const team = await prisma.team.findUnique({
        where: { id: modelId },
      });
      return team.workspaceId;

    case ModelName.TeamPreference:
      const teamPreference = await prisma.teamPreference.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return teamPreference.team.workspaceId;

    case ModelName.Issue:
      const issue = await prisma.issue.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return issue.team.workspaceId;

    case ModelName.Label:
      const label = await prisma.label.findUnique({
        where: { id: modelId },
      });
      return label.workspaceId;

    case ModelName.Workflow:
      const workflow = await prisma.workflow.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return workflow.team.workspaceId;

    case ModelName.Template:
      const template = await prisma.template.findUnique({
        where: { id: modelId },
      });
      return template.workspaceId;

    case ModelName.IssueComment:
      const issuecomment = await prisma.issueComment.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issuecomment.issue.team.workspaceId;

    case ModelName.IssueHistory:
      const issueHistory = await prisma.issueHistory.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issueHistory.issue.team.workspaceId;

    case ModelName.IntegrationDefinition:
      const integrationDefinition =
        await prisma.integrationDefinition.findUnique({
          where: { id: modelId },
        });
      return integrationDefinition.workspaceId;

    case ModelName.IntegrationAccount:
      const integrationAccount = await prisma.integrationAccount.findUnique({
        where: { id: modelId },
      });
      return integrationAccount.workspaceId;

    case ModelName.LinkedIssue:
      const linkedIssue = await prisma.linkedIssue.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return linkedIssue.issue.team.workspaceId;

    case ModelName.IssueRelation:
      const issueRelation = await prisma.issueRelation.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issueRelation.issue.team.workspaceId;

    case ModelName.Notification:
      const notification = await prisma.notification.findUnique({
        where: { id: modelId },
      });
      return notification.workspaceId;

    case ModelName.View:
      const view = await prisma.view.findUnique({
        where: { id: modelId },
      });
      return view.workspaceId;

    default:
      return undefined;
  }
}

export async function getModelData(
  prisma: PrismaService,
  modelName: ModelName,
  modelId: string,
  userId?: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelMap: Record<ModelName, any> = {
    Workspace: prisma.workspace,
    UsersOnWorkspaces: prisma.usersOnWorkspaces,
    Team: prisma.team,
    TeamPreference: prisma.teamPreference,
    Issue: prisma.issue,
    Label: prisma.label,
    Workflow: prisma.workflow,
    Template: prisma.template,
    IssueComment: prisma.issueComment,
    IssueHistory: prisma.issueHistory,
    IntegrationDefinition: {
      findUnique: (args: { where: { id: string } }) =>
        prisma.integrationDefinition.findUnique({
          ...args,
          select: {
            id: true,
            name: true,
            icon: true,
            workspaceId: true,
            createdAt: true,
            updatedAt: true,
            deleted: true,
            scopes: true,
            spec: true,
          },
        }),
    },
    IntegrationAccount: {
      findUnique: (args: { where: { id: string } }) =>
        prisma.integrationAccount.findUnique({
          ...args,
          select: {
            id: true,
            accountId: true,
            settings: true,
            integratedById: true,
            createdAt: true,
            updatedAt: true,
            deleted: true,
            workspaceId: true,
            integrationDefinitionId: true,
          },
        }),
    },
    LinkedIssue: prisma.linkedIssue,
    IssueRelation: prisma.issueRelation,
    Notification: {
      findUnique: () => {
        if (userId) {
          return prisma.notification.findFirst({
            where: {
              id: modelId,
              userId,
            },
          });
        }
        return prisma.notification.findUnique({ where: { id: modelId } });
      },
    },
    View: prisma.view,
  };

  const model = modelMap[modelName];

  if (model) {
    return await model.findUnique({ where: { id: modelId } });
  }

  return undefined;
}

export async function getSyncActionsData(
  prisma: PrismaService,
  syncActionsData: SyncAction[],
  userId: string,
) {
  const modelDataResults = await Promise.all(
    syncActionsData.map((actionData) =>
      getModelData(prisma, actionData.modelName, actionData.modelId, userId),
    ),
  );

  return syncActionsData.reduce((result, actionData, index) => {
    const data = modelDataResults[index];
    if (data) {
      result.push({ data, ...actionData });
    }
    return result;
  }, []);
}

export async function getLastSequenceId(
  prisma: PrismaService,
  workspaceId: string,
): Promise<bigint> {
  const lastSyncAction = await prisma.syncAction.findFirst({
    where: {
      workspaceId,
    },
    orderBy: {
      sequenceId: 'desc',
    },
    distinct: ['modelName', 'workspaceId', 'modelId'],
  });

  return lastSyncAction.sequenceId;
}
