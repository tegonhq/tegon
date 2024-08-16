import { WebhookData } from '@tegonhq/types';
import { logger } from '@trigger.dev/sdk/v3';
import axios from 'axios';

import { slackThread } from './thread';
import { slackTriage } from './triage';
import { getTokenFromAPI, setToken } from '../../utils/token';
import { SlackIntegrationSettings } from '../types';

export const webhookHandler = async (payload: WebhookData) => {
  const { eventBody, eventHeaders } = payload;

  // Check if the event is a URL verification challenge
  if (eventBody.type === 'url_verification') {
    logger.log('Responding to Slack URL verification challenge');
    return { challenge: eventBody.challenge };
  }

  const { event, team_id: teamId } = eventBody;

  const { token, userId } = await getTokenFromAPI({
    userAccountId: event.user?.slackUserId ?? teamId,
  });

  setToken(token);

  const integrationAccount = (
    await axios.get(
      `${process.env.BACKEND_HOST}/v1/integration_account/accountId?accountId=${teamId}`,
    )
  ).data;

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

  const webhookPayload = {
    eventBody,
    eventHeaders,
  };

  // Handle different event types
  switch (event.type) {
    case 'message':
      // Handle thread messages
      await slackThread(integrationAccount, webhookPayload);
      break;
    case 'reaction_added':
      // Handle message reactions)
      await slackTriage(integrationAccount, userId, webhookPayload);
      break;
    default:
      logger.debug('Unhandled Slack event type:', event.type);
      return undefined;
  }

  return { status: 200 };
};
