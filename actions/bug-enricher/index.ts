import { ActionEventPayload, ActionTypesEnum } from '@tegonhq/sdk';
import { bugEnricher } from 'triggers/bug-enricher';
import { getInputs } from 'triggers/get-inputs';
export async function run(eventPayload: ActionEventPayload) {
  switch (eventPayload.event) {
    case ActionTypesEnum.GET_INPUTS:
      return getInputs();

    case ActionTypesEnum.ON_CREATE:
      return bugEnricher(eventPayload);

    default:
      return {
        message: `The event payload type "${eventPayload.event}" is not recognized`,
      };
  }
}
