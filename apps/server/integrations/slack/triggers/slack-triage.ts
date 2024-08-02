import { IntegrationName, PrismaClient } from '@prisma/client';
import { logger, task, wait } from '@trigger.dev/sdk/v3';
import { PrismaService } from 'nestjs-prisma';

import AIRequestsService from 'modules/ai-requests/ai-requests.services';
import { AttachmentResponse } from 'modules/attachments/attachments.interface';
import {
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';
import { EventBody } from 'modules/integrations/integrations.interface';
import {
  slackIssueData,
  SlashCommandSessionRecord,
} from 'modules/integrations/slack/slack.interface';
import {
  convertSlackMessageToTiptapJson,
  getExternalSlackUser,
  getSlackMessage,
  sendEphemeralMessage,
  sendSlackMessage,
} from 'modules/integrations/slack/slack.utils';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import {
  CreateIssueInput,
  IssueRequestParams,
  IssueWithRelations,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { LinkedSlackMessageType } from 'modules/linked-issue/linked-issue.interface';

import {
  createIssueCommentAndLinkIssue,
  getIssueMessageModal,
  getSlackUserIntegrationAccount,
} from './slack-utils';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
const issueHistory = new IssuesHistoryService(prismaService);
const issueRelation = new IssueRelationService(prismaService);
const aiRequestsService = new AIRequestsService(prismaService);
const issuesService = new IssuesService(
  prismaService,
  issueHistory,
  issueRelation,
  aiRequestsService,
);

export const slackTriage = task({
  id: 'slack-triage',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: any, { ctx }) => {
    logger.log('Hello, world!', { payload, ctx });

    const { eventBody, integrationAccount } = payload;
    logger.log(eventBody, integrationAccount);
    await wait.for({ seconds: 5 });

    // const user = await prisma.user.findUnique({
    //   where: { id: 'eb44d8d3-08da-453f-bc29-4c52da08cb72' },
    // });
    const issue = await handleMessageReaction(eventBody, integrationAccount);
    return {
      issue,
    };
  },
});

async function handleMessageReaction(
  eventBody: EventBody,
  integrationAccount: IntegrationAccountWithRelations,
): Promise<IssueWithRelations | undefined> {
  // Extract relevant data from the event body
  const { event, team_id: slackTeamId } = eventBody;
  const { reaction } = event;
  const {
    item: { channel: channelId, ts: threadTs },
    user: slackUserId,
  } = event;

  // Find the channel mapping for the given channel ID
  const channelMapping = (
    integrationAccount.settings as Settings
  ).Slack.channelMappings.find(
    ({ channelId: mappedChannelId }) => mappedChannelId === channelId,
  );

  // If the reaction is not 'eyes' or the channel mapping doesn't exist, ignore the event
  if (reaction !== 'eyes' || !channelMapping) {
    logger.debug(`Ignoring reaction event with reaction: ${reaction}`);
    return undefined;
  }

  // Extract Slack settings from the integration account
  const slackSettings = integrationAccount.settings as Settings;
  const {
    Slack: { teamDomain: slackTeamDomain, channelMappings },
  } = slackSettings;

  // Check if the channel is connected
  const channelConnection = channelMappings.find(
    (mapping) => mapping.channelId === channelId,
  );

  if (!channelConnection) {
    logger.debug(`The channel is not connected`);
    return undefined;
  }

  const teamId = channelConnection.teams[0].teamId;

  // Create session data object
  const sessionData: SlashCommandSessionRecord = {
    channelId,
    threadTs,
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

  // Send an ephemeral message to the user indicating that a new issue is being created
  await sendEphemeralMessage(
    integrationAccount,
    channelId,
    `Creating a New Issue`,
    slackMessageResponse.messages[0].thread_ts || threadTs,
    slackUserId,
  );

  // Check if the thread is already linked to an existing issue
  const [linkedIssue, [stateId, userId]] = await Promise.all([
    prisma.linkedIssue.findFirst({
      where: {
        sourceId: `${channelId}_${slackMessageResponse.messages[0].thread_ts || threadTs}`,
      },
    }),
    Promise.all([
      getState(prisma, 'opened', sessionData.teamId),
      getUserId(prisma, { id: slackUserId }),
    ]),
  ]);

  // If the thread is already linked to an issue, send an ephemeral message and return
  if (linkedIssue) {
    await sendEphemeralMessage(
      integrationAccount,
      channelId,
      `This thread is already linked with an existing Issue. so we can't create a new Issue`,
      slackMessageResponse.messages[0].thread_ts || threadTs,
      slackUserId,
    );

    logger.debug(
      `Thread already linked to an existing issue. Skipping issue creation.`,
    );
    return undefined;
  }

  // Get the Slack user details using the integration account and the user ID from the event
  const slackUserResponse = await getExternalSlackUser(
    integrationAccount,
    event.user,
  );

  const slackUsername = slackUserResponse.user?.real_name || 'Slack';

  // Create source metadata object
  const sourceMetadata = {
    id: integrationAccount.id,
    type: IntegrationName.Slack,
    subType: LinkedSlackMessageType.Thread,
    channelId: sessionData.channelId,
    userDisplayName: slackUsername,
  };

  let attachmentUrls: AttachmentResponse[];
  //   if (slackMessageResponse.messages[0].files) {
  //     // Get the files buffer from Slack using the integration account and message files
  //     const multerFiles = await getFilesBuffer(
  //       integrationAccount,
  //       slackMessageResponse.messages[0].files,
  //     );
  //     // Upload the files to GCP and get the attachment URLs
  //     attachmentUrls = await attachmentService.uploadAttachment(
  //       multerFiles,
  //       userId,
  //       integrationAccount.workspaceId,
  //       sourceMetadata,
  //     );
  //   }

  // Convert the Slack message blocks to Tiptap JSON format, including the attachment URLs
  const description = convertSlackMessageToTiptapJson(
    slackMessageResponse.messages[0].blocks,
    attachmentUrls,
  );

  // Create issue input data
  const issueInput: UpdateIssueInput = {
    description,
    stateId,
    isBidirectional: true,
    subscriberIds: [...(userId ? [userId] : [])],
  } as UpdateIssueInput;

  // Create issue data object
  const issueData: slackIssueData = { issueInput, sourceMetadata, userId };

  logger.debug(`Creating Slack issue with data: ${JSON.stringify(issueData)}`);

  // Create a new Slack issue using the integration account, session data, and issue data
  return await createSlackIssue(integrationAccount, sessionData, issueData);
}

async function getState(
  prisma: PrismaClient,
  action: string,
  teamId: string,
): Promise<string> {
  const category =
    action === 'opened' ? 'TRIAGE' : action === 'closed' ? 'COMPLETED' : null;

  if (category) {
    const workflow = await prisma.workflow.findFirst({
      where: { teamId, category },
      orderBy: { position: 'asc' },
    });
    return workflow?.id;
  }

  return undefined;
}

async function getUserId(
  prisma: PrismaClient,
  userData: Record<string, string>,
) {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId: userData?.id.toString() },
    select: { integratedById: true },
  });

  return integrationAccount?.integratedById || null;
}

async function createSlackIssue(
  integrationAccount: IntegrationAccountWithRelations,
  sessionData: SlashCommandSessionRecord,
  issueData: slackIssueData,
) {
  // Extract issueInput, sourceMetadata, and userId from issueData
  const { issueInput, sourceMetadata, userId } = issueData;

  // Create a new issue using the IssuesService
  const createdIssue = await issuesService.createIssueAPI(
    { teamId: sessionData.teamId } as TeamRequestParams,
    issueInput as CreateIssueInput,
    userId,
    null,
    sourceMetadata,
  );

  // Get the Slack integration account for the user who created the issue
  const slackIntegrationAccount = await getSlackUserIntegrationAccount(
    prisma,
    createdIssue.createdById,
    createdIssue.team.workspaceId,
  );

  const slackUserId = slackIntegrationAccount
    ? slackIntegrationAccount.accountId
    : sessionData.messagedById;

  // Prepare the payload for sending a Slack message
  const payload = {
    channel: sessionData.channelId,
    text: `<@${slackUserId}> created a Issue`,
    attachments: await getIssueMessageModal(prisma, createdIssue),
    ...(sessionData.threadTs ? { thread_ts: sessionData.threadTs } : {}),
  };

  // Send the Slack message
  const messageResponse = await sendSlackMessage(integrationAccount, payload);

  if (messageResponse.ok) {
    // If the message was sent successfully, create an issue comment and link the issue
    const linkedIssueData = await createIssueCommentAndLinkIssue(
      prisma,
      messageResponse.message,
      sessionData,
      integrationAccount,
      createdIssue,
      userId,
    );

    // Update the issue with the linked issue data
    await issuesService.updateIssueApi(
      { teamId: sessionData.teamId } as TeamRequestParams,
      {} as UpdateIssueInput,
      { issueId: createdIssue.id } as IssueRequestParams,
      userId,
      linkedIssueData,
      sourceMetadata,
    );
  }

  // Return the created issue
  return createdIssue;
}
