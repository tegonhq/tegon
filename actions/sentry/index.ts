import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';
// import { webhookHandler } from './handlers/webhook-handler';

export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    // case ActionTypesEnum.SOURCE_WEBHOOK:
    // return webhookHandler(eventPayload);

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
