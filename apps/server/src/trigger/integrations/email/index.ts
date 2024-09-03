import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { integrationCreate } from './account-create';
import { getIdentifier } from './get-identifier';
import { spec } from './spec';

async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    /**
     * This is used to identify to which integration account the webhook belongs to
     */
    case IntegrationPayloadEventType.GET_IDENTIFIER:
      return await getIdentifier(eventPayload.data.eventBody);

    case IntegrationPayloadEventType.SPEC:
      return spec();
    // Used to save settings data
    case IntegrationPayloadEventType.CREATE:
      return await integrationCreate(
        eventPayload.userId,
        eventPayload.workspaceId,
        eventPayload.data,
      );

    default:
      return {
        message: `The event payload type is ${eventPayload.event}`,
      };
  }
}

export const emailHandler = task({ id: 'email', run });
