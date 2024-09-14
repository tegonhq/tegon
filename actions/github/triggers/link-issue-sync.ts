import {
  ActionEventPayload,
  ActionTypesEnum,
  getLinkedIssue,
  JsonObject,
  logger,
} from '@tegonhq/sdk';
import axios from 'axios';
import { getGithubHeaders } from 'utils';

export const linkIssueSync = async (actionPayload: ActionEventPayload) => {
  switch (actionPayload.event) {
    case ActionTypesEnum.ON_UPDATE:
      return await onUpdateLinkedIssue(actionPayload);

    default:
      return {
        message: `This event ${actionPayload.event} is not handled in LinkedIssue Sync`,
      };
  }
};

async function onUpdateLinkedIssue(actionPayload: ActionEventPayload) {
  console.log(actionPayload);
  const {
    modelId: linkedIssueId,
    changedData,
    integrationAccounts: { github: integrationAccount },
  } = actionPayload;

  const { botToken } = integrationAccount.integrationConfiguration;

  if (changedData.sync !== undefined) {
    const linkedIssue = await getLinkedIssue({ linkedIssueId });

    const sourceData = linkedIssue.sourceData as JsonObject;

    const {
      issue: { team, number: issueNumber },
    } = linkedIssue;
    const { identifier: teamIdentifier } = team;

    // Create the issue identifier
    const issueIdentifier = `${teamIdentifier}-${issueNumber}`;

    // Create the issue URL using the workspace slug and issue identifier
    const issueUrl = `https://app.tegon.ai/${integrationAccount.workspace.slug}/issue/${issueIdentifier}`;

    let body = `Stopping sync with Tegon issue [${issueIdentifier}](${issueUrl})`;
    if (changedData.sync) {
      body = `This thread is syncing with a Tegon issue [${issueIdentifier}](${issueUrl})`;
    }

    await axios.post(
      `${sourceData.apiUrl}/comments`,
      { body },
      getGithubHeaders(botToken),
    );

    logger.debug(
      `Github message sent successfully for linked issue: ${issueIdentifier}`,
    );

    return { message: `Github message sent successfully` };
  }

  return { message: 'ignoring the change in linked issue' };
}
