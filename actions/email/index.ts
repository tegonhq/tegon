import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

import { onEventHandler } from './handlers/on-event-handler';
import { getConfig } from 'handlers/get-config';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.GET_CONFIG:
      return getConfig(eventPayload);

    case ActionTypesEnum.SOURCE_WEBHOOK:
      return onEventHandler(eventPayload);

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
