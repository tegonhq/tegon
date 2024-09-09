import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';
import { getInputs } from 'handlers/get-inputs';
import { onCreateHandler } from 'handlers/on-create-handler';
import { onUpdateHandler } from 'handlers/on-update-handler';
import { webhookHandler } from 'handlers/webhook-handler';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.GET_INPUTS:
      return getInputs(eventPayload);

    case ActionTypesEnum.ON_CREATE:
      return await onCreateHandler(eventPayload);

    case ActionTypesEnum.ON_UPDATE:
      return await onUpdateHandler(eventPayload);

    case ActionTypesEnum.SOURCE_WEBHOOK:
      return webhookHandler(eventPayload);

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
