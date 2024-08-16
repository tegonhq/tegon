import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { integrationCreate } from './account-create';
import { spec } from './spec';

async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    case IntegrationPayloadEventType.CREATE:
      return spec();

    // Used to save settings data
    case IntegrationPayloadEventType.DELETE:
      return await integrationCreate(
        eventPayload.payload.userId,
        eventPayload.payload.workspaceId,
        eventPayload.payload.data,
      );

    default:
      return {
        message: `The event payload type is ${eventPayload.event}`,
      };
  }
}

export const githubHandler = task({ id: 'github', run });
