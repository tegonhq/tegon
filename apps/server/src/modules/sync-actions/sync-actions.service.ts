import { Injectable } from '@nestjs/common';
import { ActionTypeEnum, ModelNameEnum, SyncAction } from '@tegonhq/types';
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
    modelName: ModelNameEnum,
    modelId: string,
    isDeleted: boolean,
  ) {
    const workspaceId = await getWorkspaceId(this.prisma, modelName, modelId);
    const sequenceId = convertLsnToInt(lsn);
    let actionType = convertToActionType(action);

    if (isDeleted) {
      actionType = ActionTypeEnum.D;
    }
    const syncActionData = await this.prisma.syncAction.upsert({
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

    const modelData = await getModelData(this.prisma, modelName, modelId);

    return {
      data: modelData,
      ...syncActionData,
    };
  }

  async getBootstrap(modelNames: string, workspaceId: string, userId: string) {
    let syncActions = await this.prisma.syncAction.findMany({
      where: {
        workspaceId,
        modelName: { in: modelNames.split(',') as ModelNameEnum[] },
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
      syncActions: await getSyncActionsData(
        this.prisma,
        syncActions as SyncAction[],
        userId,
      ),
      lastSequenceId: await getLastSequenceId(this.prisma, workspaceId),
    };
  }

  async getDelta(
    modelNames: string,
    lastSequenceId: bigint,
    workspaceId: string,
    userId: string,
  ) {
    const syncActions = await this.prisma.syncAction.findMany({
      where: {
        workspaceId,
        sequenceId: { gt: lastSequenceId },
        modelName: { in: modelNames.split(',') as ModelNameEnum[] },
      },
      orderBy: {
        sequenceId: 'asc',
      },
      distinct: ['modelId', 'modelName', 'workspaceId', 'action'],
    });

    return {
      syncActions: await getSyncActionsData(
        this.prisma,
        syncActions as SyncAction[],
        userId,
      ),
      lastSequenceId: await getLastSequenceId(this.prisma, workspaceId),
    };
  }
}
