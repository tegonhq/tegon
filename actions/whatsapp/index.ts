import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

import { webhookHandler } from './handlers/webhook-handler';
import { getInputs } from 'handlers/get-inputs';
import { onCreateHandler } from 'handlers/on-create-handler';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.GET_INPUTS:
      return getInputs(eventPayload);

    case ActionTypesEnum.SOURCE_WEBHOOK:
      return webhookHandler(eventPayload);

    case ActionTypesEnum.ON_CREATE:
      return await onCreateHandler(eventPayload);

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}