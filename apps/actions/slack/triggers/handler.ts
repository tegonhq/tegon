import {
  ActionEventPayload,
  ActionTypesEnum,
  IntegrationAccount,
} from '@tegonhq/types';

import { onCreateHandler } from './onCreate-handler';
import { webhookHandler } from './webhook-handler';
import { handler } from '../../utils/handler';

async function run(eventPayload: ActionEventPayload) {
  const event = eventPayload.event;
  switch (event) {
    case ActionTypesEnum.OnCreate:
      return onCreateHandler(eventPayload.payload);

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
