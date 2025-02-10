import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ActionEntity,
  ActionEvent,
  ActionStatusEnum,
  ActionTypesEnum,
} from '@tegonhq/types';
import { tasks } from '@trigger.dev/sdk/v3';
import { PrismaService } from 'nestjs-prisma';
import { actionRun } from 'trigger/action-run';

import { IntegrationsService } from 'modules/integrations/integrations.service';
import { LoggerService } from 'modules/logger/logger.service';
import { convertLsnToInt } from 'modules/sync-actions/sync-actions.utils';

import { CreateActionEvent } from './action-event.interface';
import { prepareTriggerPayload } from './action-event.utils';

const SUPPORTED_MODELS = ['Issue', 'IssueComment', 'LinkedIssue'];

@Injectable()
export default class ActionEventService {
  private readonly logger: LoggerService = new LoggerService(
    'ActionEventService',
  );

  constructor(
    private prisma: PrismaService,

    private integrationsService: IntegrationsService,
    private configService: ConfigService,
  ) {}

  async createEvent(event: CreateActionEvent) {
    if (SUPPORTED_MODELS.includes(event.modelName)) {
      const eventType = this.getEventType(event);
      const sequenceId = convertLsnToInt(event.sequenceId);

      // We have to handle this because the data received in replication service
      // is a multiple of number of replication slots
      const existingActionEvent = await this.prisma.actionEvent.findFirst({
        where: {
          sequenceId,
          modelId: event.modelId,
          modelName: event.modelName,
        },
      });

      if (!existingActionEvent) {
        const actionEvent = await this.prisma.actionEvent.create({
          data: {
            ...event,
            eventType,
            eventData:
              eventType === ActionTypesEnum.ON_UPDATE ? event.eventData : {},
            sequenceId,
          },
        });

        const processedIds = await this.triggerActions(actionEvent);
        this.updateEvent(actionEvent.id, processedIds);

        await this.triggerWebhookAction(actionEvent, event.workspaceId);
      }
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
      this.logger.info({
        message: 'No actions to trigger',
        payload: { actionEntities },
        where: `ActionEventService.triggerActions`,
      });
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
      this.integrationsService,
      actionEntity.action.id,
    );

    const triggerHandle = await tasks.trigger<typeof actionRun>('action-run', {
      workspaceId: actionEvent.workspaceId,
      payload: {
        event: actionEvent.eventType,
        changedData: actionEvent.eventData,
        type: actionEvent.modelName,
        modelId: actionEvent.modelId,
        ...addedTaskInfo,
      },
    });

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
