/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { SyncAction } from '@prisma/client';
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
  async upsertSyncAction(
    lsn: string,
    action: string,
    modelName: string,
    modelId: string,
    isDeleted: boolean,
  ) {
    const workspaceId = await getWorkspaceId(this.prisma, modelName, modelId);
    const sequenceId = convertLsnToInt(lsn);
    const actionType = convertToActionType(action);

    let syncActionData: SyncAction;

    if (isDeleted) {
      syncActionData = await this.prisma.syncAction.create({
        data: {
          action: 'D',
          modelId,
          modelName,
          workspaceId,
          sequenceId,
        },
      });
    } else {
      syncActionData = await this.prisma.syncAction.upsert({
        where: {
          modelId_action: {
            modelId,
            action: actionType,
          },
        },
        update: {
          sequenceId,
          action: actionType,
        },
        create: {
          action: actionType,
          modelName,
          modelId,
          workspaceId,
          sequenceId,
        },
      });
    }

    const modelData = await getModelData(this.prisma, modelName, modelId);

    return {
      data: modelData,
      ...syncActionData,
    };
  }

  async getBootstrap(models: string, workspaceId: string) {
    let syncActions = await this.prisma.syncAction.findMany({
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

    const deleteModelIds = new Set(
      syncActions
        .filter((action) => action.action === 'D')
        .map((action) => action.modelId),
    );

    syncActions = syncActions.filter(
      (action) => !deleteModelIds.has(action.modelId),
    );

    return {
      syncActions: await getSyncActionsData(this.prisma, syncActions),
      lastSequenceId: await getLastSequenceId(this.prisma, workspaceId),
    };
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
      lastSequenceId: await await getLastSequenceId(this.prisma, workspaceId),
    };
  }
}
