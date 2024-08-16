import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

import { onCreateHandler } from './handlers/on-create-handler';
import { webhookHandler } from './handlers/webhook-handler';

export async function run(eventPayload: ActionEventPayload) {
  const event = eventPayload.event;
  switch (event) {
    case ActionTypesEnum.OnCreate:
      return onCreateHandler(eventPayload.payload);

    case ActionTypesEnum.ExternalWebhook:
      return webhookHandler({
        data: eventPayload.payload,
        userId: eventPayload.payload.userId,
      });

    default:
      return {
        message: `The event payload type "${event}" is not recognized`,
      };
  }
}
