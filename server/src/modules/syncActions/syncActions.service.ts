/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { ActionType, SyncAction } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreateSyncActionDto } from '@@generated/syncAction/dto';

@Injectable()
export default class SyncActionsService {
  constructor(private prisma: PrismaService) {}
  async createSyncAction(
    action: ActionType,
    modelName: string,
    modelId: string,
    syncActionData: CreateSyncActionDto['data'],
  ): Promise<SyncAction> {
    return await this.prisma.syncAction.create({
      data: {
        id: Date.now(),
        action,
        modelName,
        modelId,
        data: syncActionData,
      },
    });
  }
}
