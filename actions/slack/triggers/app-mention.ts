import type { EventBody, IntegrationAccount } from '@tegonhq/sdk';

import {
  logger,
  getLinkedIssueBySource,
  getWorkflowsByTeam,
  updateIssue,
  getTeamById,
} from '@tegonhq/sdk';

import { slackIssueCreate } from './issue-create';
import {
  SlackCreateIssuePayload,
  SlackIntegrationSettings,
  SlackSourceMetadata,
  SlashCommandSessionRecord,
} from '../types';
import {
  convertSlackMessageToTiptapJson,
  getAttachmentUrls,
  getExternalSlackUser,
  getIssueMessageModal,
  getSlackReplies,
  getStateId,
  sendEphemeralMessage,
  sendSlackMessage,
} from '../utils';

export const appMention = async (
  integrationAccount: IntegrationAccount,
  userId: string,
  eventBody: EventBody,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) => {
  const { event, team_id: slackTeamId } = eventBody;

  // Destructure channel, user, ts (timestamp), and thread_ts (thread timestamp) from event
  const { channel: channelId, user: slackUserId } = event;

  let { ts: threadTs, thread_ts: parentTs } = event;

  let isParent = false;
  // If threadTs is present and parentTs is not, set isParent to true and swap the values
  if (threadTs && !parentTs) {
    isParent = true;
    parentTs = event.ts;
    threadTs = null;
  }

  // Extract Slack settings from the integration account
  const slackSettings =
    integrationAccount.settings as unknown as SlackIntegrationSettings;
  const { teamDomain: slackTeamDomain } = slackSettings;

  // Find the channel mapping for the given channel ID
  const channelMapping = action.data.inputs.channelTeamMappings.find(
    ({ channelId: mappedChannelId }: { channelId: string }) =>
      mappedChannelId === channelId,
  );

  // If no channel mapping is found, log a debug message and return
  if (!channelMapping) {
    logger.debug(`The channel is not connected`);
    return undefined;
  }

  const teamId = channelMapping.teamId;

  // Create session data object
  const sessionData: SlashCommandSessionRecord = {
    channelId,
    parentTs,
    threadTs,
    slackTeamId,
    slackTeamDomain,
    teamId,
    messagedById: slackUserId,
  };

  logger.debug(`Session data: ${JSON.stringify(sessionData)}`);

  const sourceId = `${channelId}_${parentTs}`;
  const mainTs = parentTs;

  // Check if the thread is already linked to an existing issue
  const [linkedIssue, workflowStates] = await Promise.all([
    getLinkedIssueBySource({ sourceId }),
    getWorkflowsByTeam({ teamId }),
  ]);

  // if the thread is already linked to an issue, update the title
  if (linkedIssue) {
    logger.debug(
      `Thread already linked to an existing issue. Skipping issue creation.`,
    );

    const title = event.text.replace(/<@\w+>/g, '').trim();
    if (title.length < 1) {
      // Send an ephemeral message to the user indicating that the title is null
      await sendNullTitleEphermal(
        integrationAccount,
        channelId,
        mainTs,
        slackUserId,
      );

      return { message: 'Got empty titile in the event' };
    }

    // Update the issue title with the event text
    const updatedIssue = await updateIssue({
      issueId: linkedIssue.issueId,
      teamId: linkedIssue.issue.teamId,
      title,
    });

    const team = await getTeamById({ teamId: updatedIssue.teamId });

    // Prepare the message payload
    const messagePayload = {
      channel: sessionData.channelId,
      text: `<@${sessionData.messagedById}> updated this Issue`,
      attachments: await getIssueMessageModal(
        updatedIssue,
        team.workspace.slug,
      ),
      ...(sessionData.parentTs ? { thread_ts: sessionData.parentTs } : {}),
    };

    logger.info('Sending Slack message with payload', { messagePayload });

    // Send the Slack message
    const messageResponse = await sendSlackMessage(
      integrationAccount,
      messagePayload,
    );

    if (messageResponse.ok) {
      logger.debug(`Sent update thread notfication to Slack `);
    }

    return updateIssue;
  }

  const stateId = getStateId('opened', workflowStates);

  // Send an ephemeral message to the user indicating that a new issue is being created
  await sendEphemeralMessage(
    integrationAccount,
    channelId,
    `Creating a New Issue`,
    mainTs,
    slackUserId,
  );
  // Get the Slack user details using the integration account and the user ID from the event
  const slackUserResponse = await getExternalSlackUser(
    integrationAccount,
    event.user,
  );

  const slackUsername = slackUserResponse.user?.real_name || 'Slack';

  // Create source metadata object
  const sourceMetadata: SlackSourceMetadata = {
    id: integrationAccount.id,
    type: integrationAccount.integrationDefinition.slug,
    channelId: sessionData.channelId,
    userDisplayName: slackUsername,
  };

  // Get the Slack message using the integration account and session data
  const slackMessageResponse = await getSlackReplies(integrationAccount, {
    channelId,
    parentTs,
  });
  if (!slackMessageResponse.ok) {
    logger.error(`Failed to fetch Slack replies for parentTs: ${parentTs}`);
    return {
      message: `Failed to fetch Slack replies for parentTs: ${parentTs}`,
    };
  }

  // Get the attachment URLs
  const attachmentUrls = await getAttachmentUrls(
    slackMessageResponse,
    integrationAccount,
    sourceMetadata,
  );

  // Convert the Slack message blocks to Tiptap JSON format, including the attachment URLs
  const description = convertSlackMessageToTiptapJson(
    slackMessageResponse.messages[0].blocks,
    attachmentUrls,
  );

  let title;
  // If the message is not a parent message, set the title to the event text
  if (!isParent) {
    title = event.text.replace(/<@\w+>/g, '').trim();

    if (title.length < 1) {
      // Send an ephemeral message to the user indicating that the title is null
      await sendNullTitleEphermal(
        integrationAccount,
        channelId,
        mainTs,
        slackUserId,
      );
      return { message: 'Got empty titile in the event' };
    }
  }

  // Create linkIssueData object

  const linkIssueData = {
    url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${mainTs.replace('.', '')}`,
    sourceId,
    sourceData: {
      type: integrationAccount.integrationDefinition.slug,
      channelId: sessionData.channelId,
      parentTs: mainTs,
      title: `Slack message from: ${slackUsername}`,
      slackTeamDomain: sessionData.slackTeamDomain,
      userDisplayName: slackUsername,
    },
    createdById: userId,
  };

  // Create issue input data
  const issueInput = {
    description,
    stateId,
    isBidirectional: true,
    subscriberIds: [...(userId ? [userId] : [])],
    teamId,
    sourceMetadata,
    linkIssueData,
    ...(title ? { title } : {}),
  };

  // Call slackIssueCreate function with the necessary data
  return await slackIssueCreate({
    integrationAccount,
    sessionData,
    issueData: { issueInput, sourceMetadata, userId },
  } as SlackCreateIssuePayload);
};

async function sendNullTitleEphermal(
  integrationAccount: IntegrationAccount,
  channelId: string,
  mainTs: string,
  slackUserId: string,
) {
  await sendEphemeralMessage(
    integrationAccount,
    channelId,
    `Got empty Title, please provide some text after @Tegon`,
    mainTs,
    slackUserId,
  );
}
