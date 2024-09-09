import {
  ActionEventPayload,
  LinkedIssue,
  ModelNameEnum,
  logger,
} from '@tegonhq/sdk';
import { onLabelHandler } from './on-label-handler';
import axios from 'axios';
import { issueSync } from 'triggers/issue-sync';

export const onUpdateHandler = async (actionPayload: ActionEventPayload) => {
  // Handle different event types
  switch (actionPayload.type) {
    case ModelNameEnum.Issue:
      // TODO(new): Modify this to service
      // const linkedIssue = await getLinkedIssuesByIssueId({issueId: actionPayload.modelId})
      const linkedIssues = (
        await axios.get(
          `/api/v1/linked_issues/issue?issueId=${actionPayload.modelId}`,
        )
      ).data;
      if (linkedIssues.length > 0) {
        const githubLinkedIssues = linkedIssues.filter(
          (linkedIssue: LinkedIssue) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sourceData = linkedIssue.sourceData as Record<string, any>;
            return sourceData.type === 'github';
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
      return await onLabelHandler(actionPayload);

    case ModelNameEnum.IssueComment:
      return undefined;

    case ModelNameEnum.LinkedIssue:
      return undefined;

    default:
      logger.debug('Unhandled Github event type:', actionPayload.type);
  }

  return { status: 200 };
};
