import {
  logger,
  EventBody,
  getLinkedIssue,
  updateLinkedIssue,
  UpdateLinkedIssueDto,
  ActionEventPayload,
  getUsers,
  RoleEnum,
  ActionTypesEnum,
  JsonObject,
  getLinkedIssueBySource,
} from '@tegonhq/sdk';

import { slackLinkRegex } from '../types';
import {
  createLinkIssueComment,
  getSlackMessage,
  sendSlackMessage,
} from '../utils';

export const linkIssueSync = async (actionPayload: ActionEventPayload) => {
  switch (actionPayload.event) {
    case ActionTypesEnum.ON_CREATE:
      return await onCreateLinkedIssue(actionPayload);

    case ActionTypesEnum.ON_UPDATE:
      return await onUpdateLinkedIssue(actionPayload);

    default:
      return {
        message: `This event ${actionPayload.event} is not handled in LinkedIssue Sync`,
      };
  }
};

async function onCreateLinkedIssue(actionPayload: ActionEventPayload) {
  const {
    integrationAccounts: { slack: integrationAccount },
    modelId: linkIssueId,
  } = actionPayload;

  let linkedIssue = await getLinkedIssue({ linkedIssueId: linkIssueId });

  const userRole = (
    await getUsers({
      userIds: [linkedIssue.updatedById],
      workspaceId: integrationAccount.workspaceId,
    })
  )[0].role;

  if (userRole === RoleEnum.BOT) {
    return {
      message: `Ignoring comment created from Bot`,
    };
  }

  const match = linkedIssue.url.match(slackLinkRegex);

  if (!match) {
    return { message: 'URL not matched with slack regex' };
  }

  const [
    ,
    slackTeamDomain,
    channelId,
    messageTimestamp,
    messageTimestampMicro,
    threadTs,
  ] = match;
  const parentTs = `${messageTimestamp}.${messageTimestampMicro}`;
  const messageTs = threadTs ? threadTs.replace('p', '') : parentTs;

  let message: string;
  if (integrationAccount) {
    const slackMessageResponse = await getSlackMessage(integrationAccount, {
      channelId,
      parentTs: messageTs,
    });
    message = slackMessageResponse.messages[0].text;
  }

  const linkIssueData: UpdateLinkedIssueDto = {
    sourceId: `${channelId}_${parentTs || messageTs}`,
    sourceData: {
      channelId,
      messageTs,
      parentTs,
      slackTeamDomain,
      message,
    },
  };

  const linkedIssues = await getLinkedIssueBySource({
    sourceId: linkIssueData.sourceId,
  });
  // Check if there are multiple linked issues with the same sourceId
  // This can happen if the same thread is linked to multiple issues by mistake
  // We want to prevent this scenario and ensure that each thread is linked to only one issue
  // If there are multiple linked issues, return an error message
  if (linkedIssues.length > 0) {
    return { message: 'This thread is already in sync with another issue' };
  }

  linkedIssue = await updateLinkedIssue({
    linkedIssueId: linkIssueId,
    ...linkIssueData,
  });

  const {
    issue: { team, number: issueNumber, id: issueId },
  } = linkedIssue;
  const { identifier: teamIdentifier } = team;

  // Create the issue identifier
  const issueIdentifier = `${teamIdentifier}-${issueNumber}`;
  logger.debug(`Sending Slack message for linked issue: ${issueIdentifier}`);

  // Create the issue URL using the workspace slug and issue identifier
  const issueUrl = `https://app.tegon.ai/${integrationAccount.workspace.slug}/issue/${issueIdentifier}`;

  // Create the message payload with the issue URL and thread details
  const messagePayload: EventBody = {
    channel: channelId,
    blocks: [
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `This thread is linked with a Tegon issue <${issueUrl}|${issueIdentifier}>`,
          },
        ],
      },
    ],
    thread_ts: parentTs,
  };

  // Send the Slack message using the integration account and message payload
  const messageResponse = await sendSlackMessage(
    integrationAccount,
    messagePayload,
  );
  logger.debug(
    `Slack message sent successfully for linked issue: ${issueIdentifier}`,
  );

  if (messageResponse.ok) {
    const sourceMetadata = {
      id: integrationAccount.id,
      channelId,
      type: 'Slack',
    };

    await createLinkIssueComment(
      messageResponse,
      integrationAccount,
      linkIssueData,
      channelId,
      issueId,
      sourceMetadata,
    );
  }

  return linkedIssue;
}

async function onUpdateLinkedIssue(actionPayload: ActionEventPayload) {
  const {
    modelId: linkedIssueId,
    changedData,
    integrationAccounts: { slack: integrationAccount },
  } = actionPayload;
  if (changedData.sync !== undefined) {
    const linkedIssue = await getLinkedIssue({ linkedIssueId });

    const userRole = (
      await getUsers({
        userIds: [linkedIssue.updatedById],
        workspaceId: integrationAccount.workspaceId,
      })
    )[0].role;

    if (userRole === RoleEnum.BOT) {
      return {
        message: `Ignoring comment created from Bot`,
      };
    }

    const sourceData = linkedIssue.sourceData as JsonObject;

    const {
      issue: { team, number: issueNumber },
    } = linkedIssue;
    const { identifier: teamIdentifier } = team;

    // Create the issue identifier
    const issueIdentifier = `${teamIdentifier}-${issueNumber}`;

    // Create the issue URL using the workspace slug and issue identifier
    const issueUrl = `https://app.tegon.ai/${integrationAccount.workspace.slug}/issue/${issueIdentifier}`;

    let messageText = `Stopping sync with Tegon issue <${issueUrl}|${issueIdentifier}>`;
    if (changedData.sync) {
      messageText = `This thread is syncing with a Tegon issue <${issueUrl}|${issueIdentifier}>`;
    }

    // Create the message payload with the issue URL and thread details
    const messagePayload: EventBody = {
      channel: sourceData.channelId,
      blocks: [
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: messageText,
            },
          ],
        },
      ],
      thread_ts: sourceData.parentTs,
    };

    // Send the Slack message using the integration account and message payload
    await sendSlackMessage(integrationAccount, messagePayload);
    logger.debug(
      `Slack message sent successfully for linked issue: ${issueIdentifier}`,
    );

    return { message: `Slack message sent successfully` };
  }

  return { message: 'ignoring the change in linked issue' };
}
