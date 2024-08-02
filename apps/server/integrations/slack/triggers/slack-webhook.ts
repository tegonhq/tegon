import { PrismaClient } from '@prisma/client';
import { logger, task } from '@trigger.dev/sdk/v3';

import { Settings } from 'modules/integration-account/integration-account.interface';

import { slackThread } from './slack-thread';
import { slackTriage } from './slack-triage';
import { getSlackIntegrationAccount } from './slack-utils';
import { webhookPayload } from '../../integrations-interface';

const prisma = new PrismaClient();
export const slackWebhook = task({
  id: 'slack-webhook',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: webhookPayload, {}) => {
    const { eventBody } = payload;
    // Check if the event is a URL verification challenge
    if (eventBody.type === 'url_verification') {
      logger.log('Responding to Slack URL verification challenge');
      return { challenge: eventBody.challenge };
    }

    const { event, team_id } = eventBody;

    // Get the integration account for the Slack team
    const integrationAccount = await getSlackIntegrationAccount(
      prisma,
      team_id,
    );

    // If no integration account is found, log and return undefined
    if (!integrationAccount) {
      logger.log('No integration account found for team:', team_id);
      return undefined;
    }

    const slackSettings = integrationAccount.settings as Settings;
    // Check if the message is from the bot user
    const isBotMessage = slackSettings.Slack.botUserId === event.user;

    // If the message is from the bot, ignore it
    if (isBotMessage) {
      logger.log('Ignoring bot message');
      return undefined;
    }

    logger.log('Processing Slack event:', event.type);

    switch (event.type) {
      case 'message':
        // Handle thread messages
        // this.slackQueue.handleThreadJob(event, integrationAccount);
        slackThread.trigger({ eventBody, integrationAccount });
        break;
      case 'reaction_added':
        // Handle message reactions)
        slackTriage.trigger({
          eventBody,
          integrationAccount,
        });
        break;
      default:
        logger.log('Unhandled Slack event type:', event.type);
        return undefined;
    }

    return { status: 200 };
  },
});
