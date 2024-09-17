import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

import { onCreateHandler } from './handlers/on-create-handler';
import { webhookHandler } from './handlers/webhook-handler';
import { getInputs } from 'handlers/get-inputs';
import { onUpdateHandler } from 'handlers/on-update-handler';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.GET_INPUTS:
      return getInputs(eventPayload);

    case ActionTypesEnum.ON_CREATE:
      return onCreateHandler(eventPayload);

    case ActionTypesEnum.ON_UPDATE:
      return onUpdateHandler(eventPayload);

    case ActionTypesEnum.SOURCE_WEBHOOK:
      return webhookHandler(eventPayload);

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
