import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';

import { integrationCreate } from './internal/integration-create';
import { spec } from './spec';
import { handler } from '../../utils/handler';

async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    case IntegrationPayloadEventType.IntegrationSpec:
      return spec();
    // Used to save settings data
    case IntegrationPayloadEventType.IntegrationCreate:
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

export const sentryHandler = handler('sentry', run);
