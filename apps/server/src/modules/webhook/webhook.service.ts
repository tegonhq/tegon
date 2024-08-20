import { Injectable } from '@nestjs/common';
import {
  ActionEntity,
  ActionTypesEnum,
  EventBody,
  EventHeaders,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

import { generateKeyForUserId } from 'common/authentication';

import { getIntegrationAccountsFromActions } from 'modules/action-event/action-event.utils';
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
        return { challenge: eventBody.challenge };
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

    const workspaceId = integrationAccount.workspaceId;
    const actionEntities = await this.prisma.actionEntity.findMany({
      where: {
        type: ActionTypesEnum.SOURCE_WEBHOOK,
        entity: sourceName,
        action: { workspaceId },
        deleted: null,
      },
      include: { action: true },
    });

    const integrationAccountsMap = await getIntegrationAccountsFromActions(
      this.prisma,
      workspaceId,
      actionEntities,
    );

    integrationAccountsMap[integrationAccount.integrationDefinition.name] =
      integrationAccount;

    // TODO (actons): Send all integration accounts based on the ask
    actionEntities.map(async (actionEntity: ActionEntity) => {
      const actionUser = await this.prisma.user.findFirst({
        where: { username: actionEntity.action.name },
      });
      const accessToken = await generateKeyForUserId(actionUser.id);

      this.triggerDevService.triggerTaskAsync(
        workspaceId,
        actionEntity.action.name,
        {
          event: ActionTypesEnum.SOURCE_WEBHOOK,
          eventBody,
          eventHeaders,
          accessToken,
          userId: actionUser.id,
          integrationAccounts: integrationAccountsMap,
        },
      );
    });

    return { status: 200 };
  }
}
