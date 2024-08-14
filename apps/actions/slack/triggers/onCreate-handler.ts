import { ActionPayload, ModelNameEnum } from '@tegonhq/types';
import { logger } from '@trigger.dev/sdk/v3';

import { commentSync } from './comment-sync';
import { linkIssueSync } from './link-issue-sync';

export const onCreateHandler = async (actionPayload: ActionPayload) => {
  const { integrationAccount, data } = actionPayload;

  // Handle different event types
  switch (data.type) {
    case ModelNameEnum.IssueComment:
      return await commentSync(integrationAccount, data);

    case ModelNameEnum.LinkedIssue:
      return await linkIssueSync(integrationAccount, data);

    default:
      logger.debug('Unhandled Slack event type:', data.type);
  }

  return { status: 200 };
};
