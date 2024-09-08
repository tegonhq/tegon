import { ActionEventPayload, logger } from '@tegonhq/sdk';
import { commentEvent } from 'triggers/comment-event';

export const webhookHandler = async (
  payload: ActionEventPayload,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const { eventBody, eventHeaders } = payload;

  const eventType = eventHeaders['x-github-event'];
  if (
    ['tegon-bot[bot]', 'tegon-bot-dev[bot]'].includes(eventBody.sender.login)
  ) {
    logger.log('Ignoring BOT message from Github');
    return undefined;
  }

  switch (eventType) {
    case 'issues':
      return undefined;

    case 'issue_comment':
      return await commentEvent(payload);

    case 'pull_request':
      return undefined;

    case 'installation':
      return undefined;

    case 'installation_repositories':
      return undefined;

    default:
      logger.log(`couldn't find eventType ${eventType}`);
  }

  return undefined;
};
