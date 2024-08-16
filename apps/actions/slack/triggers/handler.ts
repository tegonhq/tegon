import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/types';

import { onCreateHandler } from './onCreate-handler';
import { webhookHandler } from './webhook-handler';
import { handler } from '../../utils/handler';

async function run(eventPayload: ActionEventPayload) {
  const eventPayloadType = eventPayload.event;
  switch (eventPayloadType) {
    case ActionTypesEnum.OnCreate:
      return onCreateHandler(eventPayload.payload);

    case ActionTypesEnum.ExternalWebhook:
      return webhookHandler(eventPayload.payload);

    default:
      return {
        message: `The event payload type "${eventPayloadType}" is not recognized`,
      };
  }
}

export const slackHandler = handler('slack', run);
