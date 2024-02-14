/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { ActionType, SyncAction } from '@prisma/client';
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
  modelName: string,
  modelId: string,
): Promise<string> {
  switch (modelName.toLocaleLowerCase()) {
    case 'workspace':
      return modelId;

    case 'team':
      const team = await prisma.team.findUnique({
        where: { id: modelId },
      });
      return team.workspaceId;

    case 'teampreference':
      const teamPreference = await prisma.teamPreference.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return teamPreference.team.workspaceId;

    case 'issue':
      const issue = await prisma.issue.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return issue.team.workspaceId;

    case 'label':
      const label = await prisma.label.findUnique({
        where: { id: modelId },
      });
      return label.workspaceId;

    case 'workflow':
      const workflow = await prisma.workflow.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return workflow.team.workspaceId;

    case 'template':
      const template = await prisma.template.findUnique({
        where: { id: modelId },
      });
      return template.workspaceId;

    case 'issuecomment':
      const issuecomment = await prisma.issueComment.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issuecomment.issue.team.workspaceId;

    case 'issuehistory':
      const issueHistory = await prisma.issueHistory.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issueHistory.issue.team.workspaceId;

    default:
      return undefined;
  }
}

export async function getModelData(
  prisma: PrismaService,
  modelName: string,
  modelId: string,
) {
  switch (modelName.toLocaleLowerCase()) {
    case 'workspace':
      return await prisma.workspace.findUnique({ where: { id: modelId } });

    case 'team':
      return await prisma.team.findUnique({ where: { id: modelId } });

    case 'teampreference':
      return await prisma.teamPreference.findUnique({ where: { id: modelId } });

    case 'issue':
      return await prisma.issue.findUnique({ where: { id: modelId } });

    case 'label':
      return await prisma.label.findUnique({ where: { id: modelId } });

    case 'workflow':
      return await prisma.workflow.findUnique({ where: { id: modelId } });

    case 'template':
      return await prisma.template.findUnique({ where: { id: modelId } });

    case 'issuecomment':
      return await prisma.issueComment.findUnique({ where: { id: modelId } });

    case 'issuehistory':
      return await prisma.issueHistory.findUnique({ where: { id: modelId } });
    default:
      return undefined;
  }
}

export async function getSyncActionsData(
  prisma: PrismaService,
  syncActionsData: SyncAction[],
) {
  return Promise.all(
    syncActionsData.map(async (actionData) => {
      const data = await getModelData(
        prisma,
        actionData.modelName,
        actionData.modelId,
      );
      return {
        data,
        ...actionData,
      };
    }),
  );
}

export async function getLastSequenceId(
  prisma: PrismaService,
  workspaceId: string,
): Promise<number> {
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
