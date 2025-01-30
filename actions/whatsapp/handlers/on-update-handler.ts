import { ActionEventPayload, ModelNameEnum, logger } from '@tegonhq/sdk';
import { issueSync } from 'triggers/update-issue';

export const onUpdateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.Issue:
      return await issueSync(actionPayload);

    default:
      logger.debug('Unhandled Whatsapp event type:', actionPayload.type);
  }

  return { status: 200 };
};
