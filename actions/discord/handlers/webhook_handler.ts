import { ActionEventPayload, logger } from '@tegonhq/sdk';
import { emojiReaction } from 'triggers/emoji-reaction';
import { discordMessage } from 'triggers/message';

export const webhookHandler = async (payload: ActionEventPayload) => {
  const {
    eventBody: {
      t: eventType,
      d: { channel_id: channelId },
    },
    integrationAccounts,
  } = payload;

  const integrationAccount = integrationAccounts.discord;

  // If no integration account is found, log and return undefined
  if (!integrationAccount) {
    logger.debug('No integration account found for team:', channelId);
    return { message: `No integration account found for team: ${channelId}` };
  }

  //   const slackSettings =
  //     integrationAccount.settings as unknown as SlackIntegrationSettings;
  //   // Check if the message is from the bot user
  //   const isBotMessage = slackSettings.botUserId === event.user;

  //   // If the message is from the bot, ignore it
  //   if (isBotMessage) {
  //     logger.debug('Ignoring bot message');
  //     return { message: `Ignoring bot message` };
  //   }

  logger.log(`Processing Discord event: ${eventType}`);

  // Handle different event types
  switch (eventType) {
    case 'MESSAGE_CREATE':
      return discordMessage(payload);

    case 'MESSAGE_REACTION_ADD':
      // Handle message reactions)
      return await emojiReaction(payload);

    case 'app_mention':
      return undefined;

    default:
      logger.debug('Unhandled Slack event type:', eventType);
      return undefined;
  }
};
