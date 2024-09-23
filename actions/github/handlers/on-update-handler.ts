import {
  ActionEventPayload,
  LinkedIssue,
  ModelNameEnum,
  getLinkedIssuesByIssueId,
  logger,
} from '@tegonhq/sdk';
import { onLabelHandler } from './on-label-handler';
import { issueSync } from 'triggers/issue-sync';
import { linkIssueSync } from 'triggers/link-issue-sync';

export const onUpdateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.Issue:
      // TODO(new): Modify this to service
      const linkedIssues = await getLinkedIssuesByIssueId({
        issueId: actionPayload.modelId,
      });
      if (linkedIssues.length > 0) {
        const githubLinkedIssues = linkedIssues.filter(
          (linkedIssue: LinkedIssue) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sourceData = linkedIssue.sourceData as Record<string, any>;
            return (
              sourceData.type === 'github' && sourceData.githubType !== 'PR'
            );
          },
        );

        if (githubLinkedIssues.length > 0) {
          return await Promise.all(
            githubLinkedIssues.map(async (linkedIssue: LinkedIssue) => {
              actionPayload.linkedIssue = linkedIssue;
              return await issueSync(actionPayload);
            }),
          );
        }
      }

      if (actionPayload.changedData.labelIds) {
        return await onLabelHandler(actionPayload);
      }

      return null;

    case ModelNameEnum.IssueComment:
      return undefined;

    case ModelNameEnum.LinkedIssue:
      return linkIssueSync(actionPayload);

    default:
      logger.debug('Unhandled Github event type:', actionPayload.type);
  }

  return { status: 200 };
};
