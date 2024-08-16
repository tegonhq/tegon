import {
  debug,
  EventBody,
  getLinkedIssueDetails,
  IntegrationAccount,
  LinkedIssueCreateActionPayload,
  updateLinkedIssue,
  UpdateLinkedIssueDto,
} from '@tegonhq/sdk';

import { slackLinkRegex } from '../types';
import {
  createLinkIssueComment,
  getSlackMessage,
  sendSlackMessage,
} from '../utils';

export const linkIssueSync = async (
  integrationAccounts: Record<string, IntegrationAccount>,
  payload: LinkedIssueCreateActionPayload,
) => {
  const integrationAccount = integrationAccounts.slack;
  const { linkIssueId } = payload;

  let linkedIssue = await getLinkedIssueDetails({ linkedIssueId: linkIssueId });

  const match = linkedIssue.url.match(slackLinkRegex);

  if (!match) {
    return;
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
    source: {
      type: 'Slack',
      integrationAccountId: integrationAccount.id,
    },
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
  debug(`Sending Slack message for linked issue: ${issueIdentifier}`);

  // Create the issue URL using the workspace slug and issue identifier
  const issueUrl = `${process.env.PUBLIC_FRONTEND_HOST}/${integrationAccount.workspace.slug}/issue/${issueIdentifier}`;

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
  debug(`Slack message sent successfully for linked issue: ${issueIdentifier}`);

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
