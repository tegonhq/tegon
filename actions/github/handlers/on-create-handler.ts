import { ActionEventPayload, ModelNameEnum, logger } from '@tegonhq/sdk';
import { onLabelHandler } from './on-label-handler';
import { commentSync } from 'triggers/comment-sync';
import { linkIssueSync } from 'triggers/link-issue-sync';

export const onCreateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.Issue:
      return await onLabelHandler(actionPayload);

    case ModelNameEnum.IssueComment:
      return await commentSync(actionPayload);

    case ModelNameEnum.LinkedIssue:
      return await linkIssueSync(actionPayload);

    default:
      logger.debug('Unhandled Github event type:', actionPayload.type);
  }

  return { status: 200 };
};
