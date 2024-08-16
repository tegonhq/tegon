import { ActionPayload, ModelNameEnum, debug } from '@tegonhq/sdk';

import { commentSync } from '../triggers/comment-sync';
import { linkIssueSync } from '../triggers/link-issue-sync';

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
      debug('Unhandled Slack event type:', data.type);
  }

  return { status: 200 };
};
