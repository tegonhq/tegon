import {
  ActionEventPayload,
  ActionTypesEnum,
  IntegrationAccount,
} from '@tegonhq/types';

import { webhookHandler } from './triggers/webhook-handler';
import { handler } from '../utils/handler';

async function run(eventPayload: ActionEventPayload) {
  const event = eventPayload.event;
  switch (event) {
    case ActionTypesEnum.OnCreate:
      return webhookHandler({
        integrationAccount: {} as IntegrationAccount,
        data: eventPayload.payload,
        userId: eventPayload.payload.userId,
      });

    case ActionTypesEnum.OnUpdate:
      return webhookHandler({
        integrationAccount: {} as IntegrationAccount,
        data: eventPayload.payload,
        userId: eventPayload.payload.userId,
      });

    case ActionTypesEnum.ExternalWebhook:
      return webhookHandler({
        integrationAccount: {} as IntegrationAccount,
        data: eventPayload.payload,
        userId: eventPayload.payload.userId,
      });

    default:
      return {
        message: `The event payload type "${event}" is not recognized`,
      };
  }
}

export const slackHandler = handler('slack', run);
