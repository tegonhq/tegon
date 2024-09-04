import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.ON_CREATE:
    // When a entity is created, look at ActionTypesEnum for more events

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
