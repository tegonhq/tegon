import { Injectable } from '@nestjs/common';
import {
  ActionEntity,
  ActionStatusEnum,
  ActionTypesEnum,
  EventBody,
  EventHeaders,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

import { prepareTriggerPayload } from 'modules/action-event/action-event.utils';
import { getActionEnv } from 'modules/action/action.utils';
import { IntegrationsService } from 'modules/integrations/integrations.service';
import { LoggerService } from 'modules/logger/logger.service';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

@Injectable()
export default class WebhookService {
  private readonly logger: LoggerService = new LoggerService('WebhookService'); // Logger instance for logging

  constructor(
    private triggerDevService: TriggerdevService,
    private prisma: PrismaService,
    private integrations: IntegrationsService,
  ) {}

  async handleEvents(
    response: Response,
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    this.logger.log({
      message: `Received webhook ${sourceName}`,
      where: `WebhookService.handleEvents`,
    });

    const webhookResponse = await this.integrations.loadIntegration(
      sourceName,
      {
        event: IntegrationPayloadEventType.WEBHOOK_RESPONSE,
        eventBody,
        eventHeaders,
      },
    );

    if (webhookResponse === false) {
      response.status(401).send('Not valid signature');
    } else {
      response.status(200).json(webhookResponse);
    }

    const isActionSupported = await this.integrations.loadIntegration(
      sourceName,
      {
        event: IntegrationPayloadEventType.IS_ACTION_SUPPORTED_EVENT,
        eventBody,
      },
    );

    if (!isActionSupported) {
      this.logger.log({
        message: `Received webhook event for ${sourceName} is not supported for actions`,
        where: `WebhookService.handleEvents`,
      });
      return false;
    }

    const accountId = await this.integrations.loadIntegration(sourceName, {
      event: IntegrationPayloadEventType.GET_CONNECTED_ACCOUNT_ID,
      data: { eventBody, eventHeaders },
    });

    const integrationAccount = await this.prisma.integrationAccount.findFirst({
      where: { accountId, deleted: null },
      include: { workspace: true, integrationDefinition: true },
    });

    if (!integrationAccount) {
      return null;
    }

    const workspaceId = integrationAccount.workspaceId;
    const actionEntities = await this.prisma.actionEntity.findMany({
      where: {
        type: ActionTypesEnum.SOURCE_WEBHOOK,
        entity: sourceName,
        action: { workspaceId, status: ActionStatusEnum.ACTIVE },
        deleted: null,
      },
      include: { action: true },
    });

    // TODO (actons): Send all integration accounts based on the ask
    actionEntities.map(async (actionEntity: ActionEntity) => {
      this.triggerDevService.triggerTaskAsync(
        workspaceId,
        actionEntity.action.slug,
        {
          event: ActionTypesEnum.SOURCE_WEBHOOK,
          eventBody,
          eventHeaders,
          ...(await prepareTriggerPayload(
            this.prisma,
            this.integrations,
            actionEntity.action.id,
          )),
        },
        getActionEnv(actionEntity.action),
        actionEntity.action.isDev
          ? {}
          : { lockToVersion: actionEntity.action.triggerVersion },
      );
    });

    return { status: 200 };
  }
}
