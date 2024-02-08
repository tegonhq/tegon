/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  convertLsnToInt,
  convertToActionType,
  getModelData,
  getWorkspaceId,
} from './syncActions.utils';

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
        workspaceId: getWorkspaceId(this.prisma, modelName, modelId),
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
    const syncActionsData = await this.prisma.syncAction.findMany({
      where: {
        workspaceId,
        modelName: {
          in: models.split(','),
        },
      },
      orderBy: {
        sequenceId: 'desc',
      },
      distinct: ['modelName', 'workspaceId', 'modelId'],
    });

    return Promise.all(
      syncActionsData.map(async (actionData) => {
        const data = await getModelData(
          this.prisma,
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

  async getDelta(lastSequenceId: number, workspaceId: string) {
    const syncActionsData = await this.prisma.syncAction.findMany({
      where: {
        workspaceId,
        sequenceId: { gte: lastSequenceId },
      },
      orderBy: {
        sequenceId: 'desc',
      },
      distinct: ['modelId', 'modelName', 'workspaceId'],
    });

    return Promise.all(
      syncActionsData.map(async (actionData) => {
        const data = await getModelData(
          this.prisma,
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
}
