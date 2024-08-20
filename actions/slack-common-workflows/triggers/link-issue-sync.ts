import {
  logger,
  EventBody,
  getLinkedIssue,
  updateLinkedIssue,
  UpdateLinkedIssueDto,
  ActionEventPayload,
  getUsers,
  RoleEnum,
} from '@tegonhq/sdk';

import { slackLinkRegex } from '../types';
import {
  createLinkIssueComment,
  getSlackMessage,
  sendSlackMessage,
} from '../utils';

export const linkIssueSync = async (actionPayload: ActionEventPayload) => {
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
      threadTs,
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
};
