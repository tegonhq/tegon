import { ActionPayload, ModelNameEnum } from '@tegonhq/types';
import { logger } from '@trigger.dev/sdk/v3';

import { commentSync } from './comment-sync';
import { linkIssueSync } from './link-issue-sync';

export const onCreateHandler = async (actionPayload: ActionPayload) => {
  const {
    data,
    data: { integrationAccounts },
  } = actionPayload;

  // Handle different event types
  switch (data.type) {
    case ModelNameEnum.IssueComment:
      return await commentSync(integrationAccounts, data);

    case ModelNameEnum.LinkedIssue:
      return await linkIssueSync(integrationAccounts, data);

    default:
      logger.debug('Unhandled Slack event type:', data.type);
  }

  return { status: 200 };
};
