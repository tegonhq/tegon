import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { webhookResponse } from './webhook-response';
import { isActionSupportedEvent } from './is_action_supported_event';
import { integrationCreate } from './account-create';

export default async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    // Used to save settings data
    case IntegrationPayloadEventType.CREATE:
      return await integrationCreate(
        eventPayload.userId,
        eventPayload.workspaceId,
        eventPayload.data,
      );

    case IntegrationPayloadEventType.WEBHOOK_RESPONSE:
      return await webhookResponse(eventPayload.eventBody);

    case IntegrationPayloadEventType.IS_ACTION_SUPPORTED_EVENT:
      return isActionSupportedEvent(eventPayload.eventBody);

    case IntegrationPayloadEventType.GET_CONNECTED_ACCOUNT_ID:
      return (
        eventPayload.data.eventBody.installationId ??
        eventPayload.data.eventBody.installation?.uuid
      );

    default:
      return {
        message: `The event payload type is ${eventPayload.event}`,
      };
  }
}
