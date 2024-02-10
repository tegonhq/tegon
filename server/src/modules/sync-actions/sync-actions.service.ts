/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  convertLsnToInt,
  convertToActionType,
  getLastSequenceId,
  getModelData,
  getSyncActionsData,
  getWorkspaceId,
} from './sync-actions.utils';

@Injectable()
export default class SyncActionsService {
  constructor(private prisma: PrismaService) {}
  async createSyncAction(
    lsn: string,
    action: string,
    modelName: string,
    modelId: string,
  ) {
    const syncActionData = await this.prisma.syncAction.upsert({
      where: {
        modelId_action: {
          modelId,
          action: convertToActionType(action),
        },
      },
      update: {
        sequenceId: convertLsnToInt(lsn),
      },
      create: {
        action: convertToActionType(action),
        modelName,
        modelId,
        workspaceId: await getWorkspaceId(this.prisma, modelName, modelId),
        sequenceId: convertLsnToInt(lsn),
      },
    });

    const modelData = await getModelData(this.prisma, modelName, modelId);

    return {
      data: modelData,
      ...syncActionData,
    };
  }

  async getBootstrap(models: string, workspaceId: string) {
    const syncActions = await this.prisma.syncAction.findMany({
      where: {
        workspaceId,
        modelName: {
          in: models.split(','),
        },
      },
      orderBy: {
        sequenceId: 'asc',
      },
      distinct: ['modelName', 'workspaceId', 'modelId', 'action'],
    });

    return {
      syncActions: await getSyncActionsData(this.prisma, syncActions),
      lastSequenceId: await await getLastSequenceId(this.prisma, workspaceId)
    }
  }

  async getDelta(lastSequenceId: number, workspaceId: string) {
    const syncActions = await this.prisma.syncAction.findMany({
      where: {
        workspaceId,
        sequenceId: { gt: lastSequenceId },
      },
      orderBy: {
        sequenceId: 'asc',
      },
      distinct: ['modelId', 'modelName', 'workspaceId', 'action'],
    });

    return {
      syncActions: await getSyncActionsData(this.prisma, syncActions),
      lastSequenceId: await await getLastSequenceId(this.prisma, workspaceId)
    }
  }
}
