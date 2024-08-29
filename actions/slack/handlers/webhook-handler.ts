import { ActionEventPayload, logger } from '@tegonhq/sdk';

import { slackThread } from '../triggers/thread';
import { slackTriage } from '../triggers/triage';

import { SlackIntegrationSettings } from '../types';

export const webhookHandler = async (payload: ActionEventPayload) => {
  const { eventBody, integrationAccounts, userId, action } = payload;

  // Check if the event is a URL verification challenge
  if (eventBody.type === 'url_verification') {
    logger.log('Responding to Slack URL verification challenge');
    return { challenge: eventBody.challenge };
  }

  const { event, team_id: teamId } = eventBody;

  const integrationAccount = integrationAccounts.slack;

  // If no integration account is found, log and return undefined
  if (!integrationAccount) {
    logger.debug('No integration account found for team:', teamId);
    return { message: `No integration account found for team: ${teamId}` };
  }

  const slackSettings =
    integrationAccount.settings as unknown as SlackIntegrationSettings;
  // Check if the message is from the bot user
  const isBotMessage = slackSettings.botUserId === event.user;

  // If the message is from the bot, ignore it
  if (isBotMessage) {
    logger.debug('Ignoring bot message');
    return { message: `Ignoring bot message` };
  }

  logger.log('Processing Slack event:', event.type);

  // Handle different event types
  switch (event.type) {
    case 'message':
      // Handle thread messages
      return await slackThread(integrationAccount, eventBody, action);
    case 'reaction_added':
      // Handle message reactions)
      return await slackTriage(integrationAccount, userId, eventBody, action);
    default:
      logger.debug('Unhandled Slack event type:', event.type);
      return undefined;
  }
};
