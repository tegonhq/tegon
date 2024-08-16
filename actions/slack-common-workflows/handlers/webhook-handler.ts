import { debug, log, WebhookData } from '@tegonhq/sdk';
import axios from 'axios';

import { slackThread } from '../triggers/thread';
import { slackTriage } from '../triggers/triage';

import { SlackIntegrationSettings } from '../types';

export const webhookHandler = async (payload: WebhookData) => {
  const { eventBody, eventHeaders } = payload.data;
  const userId = payload.userId;

  // Check if the event is a URL verification challenge
  if (eventBody.type === 'url_verification') {
    log('Responding to Slack URL verification challenge');
    return { challenge: eventBody.challenge };
  }

  const { event, team_id: teamId } = eventBody;

  const integrationAccount = (
    await axios.get(
      `${process.env.BACKEND_HOST}/v1/integration_account/accountId?accountId=${teamId}`,
    )
  ).data;

  // If no integration account is found, log and return undefined
  if (!integrationAccount) {
    debug('No integration account found for team:', teamId);
    return { message: `No integration account found for team: ${teamId}` };
  }

  const slackSettings =
    integrationAccount.settings as unknown as SlackIntegrationSettings;
  // Check if the message is from the bot user
  const isBotMessage = slackSettings.botUserId === event.user;

  // If the message is from the bot, ignore it
  if (isBotMessage) {
    debug('Ignoring bot message');
    return { message: `Ignoring bot message` };
  }

  log('Processing Slack event:', event.type);

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
      debug('Unhandled Slack event type:', event.type);
      return undefined;
  }

  return { status: 200 };
};
