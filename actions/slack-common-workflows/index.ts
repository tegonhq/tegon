import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

import { onCreateHandler } from './handlers/on-create-handler';
import { webhookHandler } from './handlers/webhook-handler';

export async function run(eventPayload: ActionEventPayload) {
  const event = eventPayload.type;
  switch (event) {
    case ActionTypesEnum.ON_CREATE:
      return onCreateHandler(eventPayload.data);

    case ActionTypesEnum.SOURCE_WEBHOOK:
      return webhookHandler({
        eventBody: eventPayload.data.eventBody,
        eventHeaders: eventPayload.data.eventHeaders,
        integrationAccounts: eventPayload.data.integrationAccounts,
        userId: eventPayload.data.userId,
      });

    default:
      return {
        message: `The event payload type "${event}" is not recognized`,
      };
  }
}
