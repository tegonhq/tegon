import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';

import { integrationCreate } from './integration-create';
import { spec } from './spec';
import { handler } from '../../utils/handler';

/**
 * This is used to fetch user token and integration account if exists
 */
async function init(eventPayload: IntegrationEventPayload) {
  if (
    eventPayload.event === IntegrationPayloadEventType.GetIntegrationAccount ||
    eventPayload.event === IntegrationPayloadEventType.Webhook
  ) {
    return { accountId: eventPayload.payload.data.eventBody.team_id };
  }

  return undefined;
}

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

export const slackHandler = handler('slack', run, init);
