import { ActionEventPayload, logger } from '@tegonhq/sdk';
import { whatsappTriage } from 'triggers/triage';

export const webhookHandler = async (payload: ActionEventPayload) => {
  const { eventBody, integrationAccounts, userId, action } = payload;

  const integrationAccount = integrationAccounts.whatsapp;

  logger.log(`Processing Whatsapp event: ${eventBody.type}`);

  // Handle different event types
  switch (eventBody.type) {
    case 'chat':
      return await whatsappTriage(
        integrationAccount,
        userId,
        eventBody,
        action,
      );

    default:
      logger.debug(`Unhandled Whatsapp event type:  ${eventBody.type}`);
      return `Unhandled Whatsapp event type:${eventBody.type}`;
  }
};
