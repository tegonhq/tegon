import { ActionEventPayload, ModelNameEnum, logger } from '@tegonhq/sdk';

import { linkIssueSync } from '../triggers/link-issue-sync';

export const onUpdateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.LinkedIssue:
      return await linkIssueSync(actionPayload);

    default:
      logger.debug('Unhandled Slack event type:', actionPayload.type);
  }

  return { status: 200 };
};
