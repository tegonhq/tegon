import { ActionEventPayload, ModelNameEnum, logger } from '@tegonhq/sdk';
import { onLabelHandler } from './on-label-handler';
import { commentSync } from 'triggers/comment-sync';

export const onCreateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.Issue:
      return await onLabelHandler(actionPayload);

    case ModelNameEnum.IssueComment:
      return await commentSync(actionPayload);

    case ModelNameEnum.LinkedIssue:
      return undefined;

    default:
      logger.debug('Unhandled Github event type:', actionPayload.type);
  }

  return { status: 200 };
};
