import { ActionEventPayload, getIssueById, logger } from '@tegonhq/sdk';
import { issueSync } from 'triggers/issue-sync';

export const onLabelHandler = async (actionPayload: ActionEventPayload) => {
  const { modelId: issueId, action } = actionPayload;
  const issue = await getIssueById({ issueId });

  const githubLabel = action.data.inputs.githubLabel;

  if (githubLabel && issue.labelIds.includes(githubLabel)) {
    logger.log(`Github mapped label present in the issue`);
    return await issueSync(actionPayload);
  }

  logger.log(`Github mapped label is not present in the issue`);
  return { status: 200 };
};
