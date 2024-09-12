import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

import { getInputs } from 'handlers/get-inputs';
import { webhookHandler } from 'handlers/webhook_handler';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.GET_INPUTS:
      return getInputs(eventPayload);

    case ActionTypesEnum.ON_CREATE:
      return;

    case ActionTypesEnum.SOURCE_WEBHOOK:
      return webhookHandler(eventPayload);

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
