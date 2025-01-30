import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';

import { integrationCreate } from './account-create';
import { spec } from './spec';
import { webhookResponse } from './webhook-response';

export default async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    /**
     * This is used to identify to which integration account the webhook belongs to
     */
    case IntegrationPayloadEventType.GET_CONNECTED_ACCOUNT_ID:
      return eventPayload.data.eventBody.accountId;

    case IntegrationPayloadEventType.SPEC:
      return spec();

    case IntegrationPayloadEventType.IS_ACTION_SUPPORTED_EVENT:
      return true;

    // Used to save settings data
    case IntegrationPayloadEventType.CREATE:
      return await integrationCreate(
        eventPayload.userId,
        eventPayload.workspaceId,
        eventPayload.data,
      );

    case IntegrationPayloadEventType.WEBHOOK_RESPONSE:
      return await webhookResponse(
        eventPayload.eventQueryParams,
        eventPayload.eventBody,
      );

    default:
      return {
        message: `The event payload type is ${eventPayload.event}`,
      };
  }
}
