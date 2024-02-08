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
}
