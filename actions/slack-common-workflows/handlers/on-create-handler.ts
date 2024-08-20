import { ActionEventPayload, ModelNameEnum, logger } from '@tegonhq/sdk';

import { commentSync } from '../triggers/comment-sync';
import { linkIssueSync } from '../triggers/link-issue-sync';

export const onCreateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.IssueComment:
      return await commentSync(actionPayload);

    case ModelNameEnum.LinkedIssue:
      return await linkIssueSync(actionPayload);

    default:
      logger.debug('Unhandled Slack event type:', actionPayload.type);
  }

  return { status: 200 };
};
