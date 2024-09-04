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
import {
  TriggerdevService,
  TriggerProjects,
} from 'modules/triggerdev/triggerdev.service';

@Injectable()
export default class WebhookService {
  constructor(
    private triggerDevService: TriggerdevService,
    private prisma: PrismaService,
  ) {}

  async handleEvents(
    response: Response,
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    if (sourceName === 'slack') {
      if (eventBody.type === 'url_verification') {
        response.send({ challenge: eventBody.challenge });
        return null;
      }
    }

    response.send({ status: 200 });

    const accountId = await this.triggerDevService.triggerTask(
      TriggerProjects.Common,
      sourceName,
      {
        event: IntegrationPayloadEventType.GET_IDENTIFIER,
        data: { eventBody, eventHeaders },
      },
    );

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
            this.triggerDevService,
            actionEntity.action.id,
          )),
        },
        { lockToVersion: actionEntity.action.triggerVersion },
      );
    });

    return { status: 200 };
  }
}
