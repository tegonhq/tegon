import { Injectable, Logger } from '@nestjs/common';
import {
  ActionEntity,
  ActionEvent,
  ActionStatusEnum,
  ActionTypesEnum,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { convertLsnToInt } from 'modules/sync-actions/sync-actions.utils';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import { CreateActionEvent } from './action-event.interface';
import { prepareTriggerPayload } from './action-event.utils';

const SUPPORTED_MODELS = ['Issue', 'IssueComment', 'LinkedIssue'];

@Injectable()
export default class ActionEventService {
  private readonly logger: Logger = new Logger('ActionEventService');

  constructor(
    private prisma: PrismaService,
    private triggerdevService: TriggerdevService,
  ) {}

  async createEvent(event: CreateActionEvent) {
    if (SUPPORTED_MODELS.includes(event.modelName)) {
      const eventType = this.getEventType(event);

      const actionEvent = await this.prisma.actionEvent.create({
        data: {
          ...event,
          eventType,
          eventData:
            eventType === ActionTypesEnum.ON_UPDATE ? event.eventData : {},
          sequenceId: convertLsnToInt(event.sequenceId),
        },
      });

      const processedIds = await this.triggerActions(actionEvent);

      this.updateEvent(actionEvent.id, processedIds);
    }
  }

  async updateEvent(eventId: string, processedIds: string[]) {
    await this.prisma.actionEvent.update({
      where: { id: eventId },
      data: { processed: true, processedIds, processedAt: new Date() },
    });
  }

  getEventType(event: CreateActionEvent) {
    switch (event.eventType.toLowerCase()) {
      case 'insert':
        return ActionTypesEnum.ON_CREATE;
      case 'update':
        return ActionTypesEnum.ON_UPDATE;
      case 'delete':
        return ActionTypesEnum.ON_DELETE;
    }

    return null;
  }

  async triggerActions(actionEvent: ActionEvent) {
    const actionEntities = await this.getActionEntities(actionEvent);

    if (actionEntities.length === 0) {
      this.logger.log('No actions to trigger');
    }

    return await Promise.all(
      actionEntities.map(async (actionEntity: ActionEntity) => {
        return await this.triggerAction(actionEvent, actionEntity);
      }),
    );
  }

  async triggerAction(actionEvent: ActionEvent, actionEntity: ActionEntity) {
    const addedTaskInfo = await prepareTriggerPayload(
      this.prisma,
      actionEntity.action.id,
    );

    const triggerHandle = await this.triggerdevService.triggerTaskAsync(
      actionEvent.workspaceId,
      actionEntity.action.slug,
      {
        event: actionEvent.eventType,
        type: actionEvent.modelName,
        modelId: actionEvent.modelId,
        ...addedTaskInfo,
      },
      { lockToVersion: actionEntity.action.triggerVersion },
    );

    return triggerHandle.id;
  }

  async getActionEntities(actionEvent: ActionEvent) {
    return await this.prisma.actionEntity.findMany({
      where: {
        type: actionEvent.eventType,
        entity: actionEvent.modelName,
        deleted: null,
        action: {
          workspaceId: actionEvent.workspaceId,
          status: ActionStatusEnum.ACTIVE,
        },
      },
      include: {
        action: true,
      },
    });
  }
}
