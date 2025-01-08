import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';

import { LoggerService } from 'modules/logger/logger.service';

import { integrationCreate } from './account-create';
import { getToken } from './get-token';
import { interaction, slashCommand } from './slash-command';
import { spec } from './spec';
import { webhookRespose } from './webhook-response';

const logger = new LoggerService('SlackIntegration');

export default async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    /**
     * This is used to identify to which integration account the webhook belongs to
     */
    case IntegrationPayloadEventType.GET_CONNECTED_ACCOUNT_ID:
      return eventPayload.data.eventBody.team_id;

    case IntegrationPayloadEventType.SPEC:
      return spec();

    // Used to save settings data
    case IntegrationPayloadEventType.CREATE:
      return await integrationCreate(
        eventPayload.userId,
        eventPayload.workspaceId,
        eventPayload.data,
      );

    case IntegrationPayloadEventType.GET_TOKEN:
      return await getToken(eventPayload.integrationAccountId);

    case IntegrationPayloadEventType.WEBHOOK_RESPONSE:
      return await webhookRespose(eventPayload.eventBody);

    case IntegrationPayloadEventType.IS_ACTION_SUPPORTED_EVENT:
      return true;

    case IntegrationPayloadEventType.PLATFORM_EVENT:
      if (eventPayload.platformEventType === 'slashCommand') {
        return await slashCommand(logger, eventPayload.eventBody);
      } else if (eventPayload.platformEventType === 'interaction') {
        return await interaction(
          logger,
          eventPayload.eventBody,
          eventPayload.issuesService,
          eventPayload.issueCommentsService,
          eventPayload.linkedIssueService,
        );
      }

      logger.warn({
        message: `Unhandled platform event type ${eventPayload.platformEventType}`,
      });

      return {
        message: `This platform event is not handled ${eventPayload.platformEventType}`,
      };

    default:
      return {
        message: `The event payload type is ${eventPayload.event}`,
      };
  }
}
