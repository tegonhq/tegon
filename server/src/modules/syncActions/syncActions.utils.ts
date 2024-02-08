/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { ActionType } from '@prisma/client';
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

export function getWorkspaceId(
  _prisma: PrismaService,
  modelName: string,
  modelId: string,
): string {
  switch (modelName.toLocaleLowerCase()) {
    case 'workspace':
      return modelId;
    default:
      return '';
  }
}

export async function getModelData(
  prisma: PrismaService,
  modelName: string,
  modelId: string,
) {
  switch (modelName.toLocaleLowerCase()) {
    case 'workspace':
      return await prisma.workspace.findUnique({
        where: {
          id: modelId,
        },
      });

    default:
      return {};
  }
}
