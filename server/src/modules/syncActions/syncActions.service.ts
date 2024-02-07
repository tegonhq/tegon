/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { ActionType, SyncAction } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export default class SyncActionsService {
  constructor(private prisma: PrismaService) {}
  async createSyncAction(action: ActionType, modelName: string, modelId: string, syncActiondata: any): Promise<SyncAction> {
    return await this.prisma.syncAction.create({
      data: {
        id: Date.now(),
        action, 
        modelName,
        modelId,
        data: syncActiondata,
      },
    });
  }
}
