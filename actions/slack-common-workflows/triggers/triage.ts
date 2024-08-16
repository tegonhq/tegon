import type {
  AttachmentResponse,
  EventBody,
  IntegrationAccount,
} from '@tegonhq/sdk';

import { debug } from '@tegonhq/sdk';

import { slackIssueCreate } from './issue-create';
import {
  SlackCreateIssuePayload,
  SlackIntegrationSettings,
  SlashCommandSessionRecord,
} from '../types';
import {
  convertSlackMessageToTiptapJson,
  getExternalSlackUser,
  getSlackMessage,
  getStateId,
  sendEphemeralMessage,
} from '../utils';

export const slackTriage = async (
  integrationAccount: IntegrationAccount,
  userId: string,
  eventBody: EventBody,
) => {
  const { event, team_id: slackTeamId } = eventBody;

  const {
    item: { channel: channelId, ts: threadTs },
    user: slackUserId,
    reaction,
  } = event;

  // Extract Slack settings from the integration account
  const slackSettings =
    integrationAccount.settings as unknown as SlackIntegrationSettings;
  const { teamDomain: slackTeamDomain, mappings: channelMappings } =
    slackSettings;

  // Find the channel mapping for the given channel ID
  const channelMapping = channelMappings.find(
    ({ channelId: mappedChannelId }: { channelId: string }) =>
      mappedChannelId === channelId,
  );

  // If the reaction is not 'eyes' or the channel mapping doesn't exist, ignore the event
  if (reaction !== 'eyes' || !channelMapping) {
    debug(`Ignoring reaction event with reaction: ${reaction}`);
    return undefined;
  }

  if (!channelMapping) {
    debug(`The channel is not connected`);
    return undefined;
  }

  const teamId = channelMapping.teamId;

  // Create session data object
  const sessionData: SlashCommandSessionRecord = {
    channelId,
    threadTs,
    slackTeamId,
    slackTeamDomain,
    teamId,
    messagedById: slackUserId,
  };

  debug(`Session data: ${JSON.stringify(sessionData)}`);

  // Get the Slack message using the integration account and session data
  const slackMessageResponse = await getSlackMessage(
    integrationAccount,
    sessionData,
  );

  const mainTs = slackMessageResponse.messages[0].thread_ts || threadTs;
  const sourceId = `${channelId}_${mainTs}`;

  // Check if the thread is already linked to an existing issue
  const [linkedIssue, workflowStates] = await Promise.all([
    getLinkedIssueBySource({sourceId})
    getWorkflowsByTeam({teamId})
  ])

  // If the thread is already linked to an issue, send an ephemeral message and return
  if (linkedIssue) {
    await sendEphemeralMessage(
      integrationAccount,
      channelId,
      `This thread is already linked with an existing Issue. so we can't create a new Issue`,
      mainTs,
      slackUserId,
    );

    debug(
      `Thread already linked to an existing issue. Skipping issue creation.`,
    );
    return undefined;
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
  const sourceMetadata = {
    id: integrationAccount.id,
    type: integrationAccount.integrationDefinition.name,
    subType: 'Thread',
    channelId: sessionData.channelId,
    userDisplayName: slackUsername,
  };

  const attachmentUrls: AttachmentResponse[] = [];
  // add Attachments

  // Convert the Slack message blocks to Tiptap JSON format, including the attachment URLs
  const description = convertSlackMessageToTiptapJson(
    slackMessageResponse.messages[0].blocks,
    attachmentUrls,
  );

  const linkIssueData = {
    url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${mainTs.replace('.', '')}`,
    sourceId,
    source: {
      type: integrationAccount.integrationDefinition.name,
      subType: 'Thread',
      integrationAccountId: integrationAccount.id,
    },
    sourceData: {
      channelId: sessionData.channelId,
      parentTs: mainTs,
      slackTeamDomain: sessionData.slackTeamDomain,
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
  };

  return await slackIssueCreate({
    integrationAccount,
    sessionData,
    issueData: { issueInput, sourceMetadata, userId },
  } as SlackCreateIssuePayload);
};
