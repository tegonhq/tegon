import { ActionEventPayload, ModelNameEnum, logger } from '@tegonhq/sdk';
import { commentSync } from 'triggers/comment-sync';

export const onCreateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.IssueComment:
      return await commentSync(actionPayload);

    default:
      logger.debug('Unhandled Whatsapp event type:', actionPayload.type);
  }

  return { status: 200 };
};
