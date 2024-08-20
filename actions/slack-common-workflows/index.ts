import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

import { onCreateHandler } from './handlers/on-create-handler';
import { webhookHandler } from './handlers/webhook-handler';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.ON_CREATE:
      return onCreateHandler(eventPayload);

    case ActionTypesEnum.SOURCE_WEBHOOK:
      return webhookHandler({
        eventBody: eventPayload.eventBody,
        eventHeaders: eventPayload.eventHeaders,
        integrationAccounts: eventPayload.integrationAccounts,
        userId: eventPayload.userId,
      });

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
