import type { EventBody, IntegrationAccount } from '@tegonhq/sdk';

import {
  logger,
  getLinkedIssueBySource,
  getWorkflowsByTeam,
} from '@tegonhq/sdk';

import { slackIssueCreate } from './issue-create';
import {
  SlackCreateIssuePayload,
  SlackIntegrationSettings,
  SlashCommandSessionRecord,
} from '../types';
import {
  convertSlackMessageToTiptapJson,
  getAttachmentUrls,
  getExternalSlackUser,
  getSlackMessage,
  getStateId,
  sendEphemeralMessage,
} from '../utils';

export const slackTriage = async (
  integrationAccount: IntegrationAccount,
  userId: string,
  eventBody: EventBody,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) => {
  const { event, team_id: slackTeamId } = eventBody;

  const { channel: channelId, ts: parentTs, user: slackUserId } = event;

  // Extract Slack settings from the integration account
  const slackSettings =
    integrationAccount.settings as unknown as SlackIntegrationSettings;
  const { teamDomain: slackTeamDomain } = slackSettings;

  // Find the channel mapping for the given channel ID
  const channelMapping = action.data.inputs.channelLabelMappings.find(
    ({ channelId: mappedChannelId }: { channelId: string }) =>
      mappedChannelId === channelId,
  );

  if (!channelMapping) {
    logger.info(`The channel is not connected`);
    return undefined;
  }

  const labelId = channelMapping.labelId;
  const teamId = action.data.inputs.teamId;

  // Create session data object
  const sessionData: SlashCommandSessionRecord = {
    channelId,
    parentTs,
    slackTeamId,
    slackTeamDomain,
    teamId,
    messagedById: slackUserId,
  };

  logger.debug(`Session data: ${JSON.stringify(sessionData)}`);

  // Get the Slack message using the integration account and session data
  const slackMessageResponse = await getSlackMessage(
    integrationAccount,
    sessionData,
  );

  const mainTs = slackMessageResponse.messages[0].thread_ts || parentTs;
  const sourceId = `${channelId}_${mainTs}`;

  // Check if the thread is already linked to an existing issue
  const [linkedIssues, workflowStates] = await Promise.all([
    getLinkedIssueBySource({ sourceId }),
    getWorkflowsByTeam({ teamId }),
  ]);

  // // If the thread is already linked to an issue, send an ephemeral message and return
  if (linkedIssues.length > 0) {
    await sendEphemeralMessage(
      integrationAccount,
      channelId,
      `This thread is already linked with an existing Issue. so we can't create a new Issue`,
      mainTs,
      slackUserId,
    );

    logger.debug(
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
    type: integrationAccount.integrationDefinition.slug,
    subType: 'Thread',
    channelId: sessionData.channelId,
    userDisplayName: slackUsername,
    descriptionText: slackMessageResponse.messages[0].text,
  };

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
    labelIds: [labelId],
    sourceMetadata,
    linkIssueData,
  };

  return await slackIssueCreate({
    integrationAccount,
    sessionData,
    issueData: { issueInput, sourceMetadata, userId },
  } as SlackCreateIssuePayload);
};
