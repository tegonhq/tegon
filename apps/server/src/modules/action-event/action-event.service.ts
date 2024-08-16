import { Injectable, Logger } from '@nestjs/common';
import {
  ActionEntity,
  ActionEvent,
  ActionTypesEnum,
  IntegrationAccount,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { generateKeyForUserId } from 'common/authentication';

import { convertLsnToInt } from 'modules/sync-actions/sync-actions.utils';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import { CreateActionEvent } from './action-event.interface';
import { getIntegrationAccountsFromActions } from './action-event.utils';

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

    const integrationMap = await getIntegrationAccountsFromActions(
      this.prisma,
      actionEvent.workspaceId,
      actionEntities,
    );

    return await Promise.all(
      actionEntities.map(async (actionEntity: ActionEntity) => {
        return await this.triggerAction(
          actionEvent,
          actionEntity,
          integrationMap,
        );
      }),
    );
  }

  async triggerAction(
    actionEvent: ActionEvent,
    actionEntity: ActionEntity,
    integrationMap: Record<string, IntegrationAccount>,
  ) {
    const actionUser = await this.prisma.user.findFirst({
      where: { username: actionEntity.action.name },
    });
    const accessToken = await generateKeyForUserId(actionUser.id);

    const triggerHandle = await this.triggerdevService.triggerTaskAsync(
      actionEvent.workspaceId,
      actionEntity.action.name,
      {
        event: actionEvent.eventType,
        data: {
          type: actionEvent.modelName,
          issueId: actionEvent.modelId,
          accessToken,
          integrationAccounts: Object.fromEntries(
            actionEntity.action.integrations.map((integrationName) => [
              integrationName,
              integrationMap[integrationName],
            ]),
          ),
        },
      },
    );

    return triggerHandle.id;
  }

  async getActionEntities(actionEvent: ActionEvent) {
    return await this.prisma.actionEntity.findMany({
      where: {
        type: actionEvent.eventType,
        entity: actionEvent.modelName,
        deleted: null,
        action: { workspaceId: actionEvent.workspaceId },
      },
      include: {
        action: true,
      },
    });
  }
}
