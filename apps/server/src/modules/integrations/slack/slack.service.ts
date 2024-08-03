import { Injectable, Logger } from '@nestjs/common';
import { IntegrationName, IssueComment } from '@prisma/client';
import { IssueWithRelations } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { AttachmentResponse } from 'modules/attachments/attachments.interface';
import { AttachmentService } from 'modules/attachments/attachments.service';
import {
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';
import {
  CreateIssueInput,
  IssueRequestParams,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { LinkedSlackMessageType } from 'modules/linked-issue/linked-issue.interface';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { OAuthCallbackService } from 'modules/oauth-callback/oauth-callback.service';

import {
  IntegrationAccountQueryParams,
  ModelViewType,
  SlashCommandSessionRecord,
  slackIssueData,
} from './slack.interface';
import { SlackQueue } from './slack.queue';
import {
  convertSlackMessageToTiptapJson,
  createIssueCommentAndLinkIssue,
  getExternalSlackUser,
  getFilesBuffer,
  getIssueData,
  getIssueMessageModal,
  getModalView,
  getSlackHeaders,
  getSlackIntegrationAccount,
  getSlackMessage,
  getSlackUserIntegrationAccount,
  getState,
  sendEphemeralMessage,
  sendSlackMessage,
} from './slack.utils';
import { EventBody } from '../integrations.interface';
import { getUserId, postRequest } from '../integrations.utils';

@Injectable()
export default class SlackService {
  // TODO(Manoj): Move this to Redis once we have multiple servers
  session: Record<string, SlashCommandSessionRecord> = {};
  constructor(
    private prisma: PrismaService,
    private oauthCallbackService: OAuthCallbackService,
    private issuesService: IssuesService,
    private linkedIssueService: LinkedIssueService,
    private attachmentService: AttachmentService,
    private slackQueue: SlackQueue,
  ) {}

  private readonly logger: Logger = new Logger('SlackService', {
    timestamp: true,
  });

  async handleEvents(eventBody: EventBody) {
    // Check if the event is a URL verification challenge
    if (eventBody.type === 'url_verification') {
      this.logger.log('Responding to Slack URL verification challenge');
      return { challenge: eventBody.challenge };
    }

    const { event, team_id } = eventBody;
    // Get the integration account for the Slack team
    const integrationAccount = await getSlackIntegrationAccount(
      this.prisma,
      team_id,
    );

    // If no integration account is found, log and return undefined
    if (!integrationAccount) {
      this.logger.debug('No integration account found for team:', team_id);
      return undefined;
    }

    const slackSettings = integrationAccount.settings as Settings;
    // Check if the message is from the bot user
    const isBotMessage = slackSettings.Slack.botUserId === event.user;

    // If the message is from the bot, ignore it
    if (isBotMessage) {
      this.logger.debug('Ignoring bot message');
      return undefined;
    }

    this.logger.log('Processing Slack event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'message':
        // Handle thread messages
        this.slackQueue.handleThreadJob(event, integrationAccount);
        break;
      case 'reaction_added':
        // Handle message reactions)
        this.slackQueue.handleMessageReactionJob(eventBody, integrationAccount);
        break;
      default:
        this.logger.debug('Unhandled Slack event type:', event.type);
        return undefined;
    }

    return { status: 200 };
  }

  async getChannelRedirectURL(
    integrationAccountQueryParams: IntegrationAccountQueryParams,
    redirectURL: string,
    userId: string,
  ) {
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: { id: integrationAccountQueryParams.integrationAccountId },
      include: { integrationDefinition: true },
    });

    return await this.oauthCallbackService.getRedirectURL(
      integrationAccount.workspaceId,
      integrationAccount.integrationDefinitionId,
      redirectURL,
      userId,
      'incoming-webhook',
    );
  }

  async slashOpenModal(eventBody: EventBody) {
    // Extract relevant data from the event body
    const { trigger_id: triggerId, token } = eventBody;
    const channelId = eventBody?.channel_id || eventBody.channel?.id;
    const slackTeamId = eventBody?.team_id || eventBody.team?.id;
    const teamDomain = eventBody?.team_domain || eventBody.team?.domain;
    const message = eventBody.message;

    this.logger.debug(
      `Received slash command event for team ${slackTeamId} in channel ${channelId}`,
    );

    // Find the integration account associated with the Slack team ID
    const integrationAccount = await this.prisma.integrationAccount.findFirst({
      where: { accountId: slackTeamId },
      include: { workspace: true, integrationDefinition: true },
    });

    // If no integration account is found, log a message and return
    if (!integrationAccount) {
      this.logger.log(`No integration account found for team ${slackTeamId}`);
      return;
    }

    // Create session data object with relevant information
    const sessionData = {
      slackTeamId,
      channelId,
      IntegrationAccountId: integrationAccount.id,
      slackTeamDomain: teamDomain,
      threadTs: message?.ts || null,
      messageText: message?.text || null,
      messagedById: message?.user || null,
    };

    this.logger.debug(
      `Creating modal view for team ${slackTeamId} in channel ${channelId}`,
    );

    // Get the modal view and updated session data based on the integration account and other parameters
    const { view, sessionData: updatedSessionData } = getModalView(
      integrationAccount,
      channelId,
      ModelViewType.CREATE,
      sessionData,
    );

    // Store the updated session data in the session object using the token as the key
    this.session[token] = updatedSessionData as SlashCommandSessionRecord;

    this.logger.debug(
      `Opening modal view for team ${slackTeamId} in channel ${channelId}`,
    );

    try {
      // Make a POST request to the Slack API to open the modal view
      await postRequest(
        'https://slack.com/api/views.open',
        getSlackHeaders(integrationAccount),
        {
          trigger_id: triggerId,
          view,
        },
      );
    } catch (error) {
      this.logger.error(
        `Error opening modal view for team ${slackTeamId} in channel ${channelId}:`,
        error,
      );
      throw error;
    }

    this.logger.debug(
      `Modal view opened successfully for team ${slackTeamId} in channel ${channelId}`,
    );
  }

  async handleViewSubmission(token: string, payload: EventBody) {
    this.logger.debug(`Handling view submission for token: ${token}`);

    // Destructure the session data and get the integration account
    const { containsDescription, ...otherSessionData } = this.session[token];
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: { id: otherSessionData.IntegrationAccountId },
      include: { workspace: true, integrationDefinition: true },
    });

    // Check if the integration account exists
    if (!integrationAccount) {
      this.logger.log(`Integration account not found for token: ${token}`);
      return { response_action: 'clear' };
    }

    // Check if the description is provided
    if (!containsDescription) {
      this.logger.debug('Description not provided, updating modal view');
      // Get the updated modal view and session data
      const { view, sessionData } = getModalView(
        integrationAccount,
        otherSessionData.channelId,
        ModelViewType.UPDATE,
        otherSessionData,
        payload,
      );
      // Update the session data
      this.session[token] = sessionData as SlashCommandSessionRecord;
      // Return the updated modal view
      return { response_action: 'update', view };
    }

    // Description is provided, create the Slack issue
    this.logger.debug('Description provided, creating Slack issue');
    // Get the issue data
    const issueData = await getIssueData(
      this.prisma,
      this.session[token],
      payload,
      integrationAccount,
    );
    // Create the Slack issue
    await this.createSlackIssue(
      integrationAccount,
      this.session[token],
      issueData,
    );

    // Clear the modal view
    return { response_action: 'clear' };
  }

  async createSlackIssue(
    integrationAccount: IntegrationAccountWithRelations,
    sessionData: SlashCommandSessionRecord,
    issueData: slackIssueData,
  ) {
    // Extract issueInput, sourceMetadata, and userId from issueData
    const { issueInput, sourceMetadata, userId } = issueData;

    // Create a new issue using the IssuesService
    const createdIssue = await this.issuesService.createIssueAPI(
      {
        ...issueInput,
        teamId: sessionData.teamId,
      } as CreateIssueInput,
      userId,
    );

    // Get the Slack integration account for the user who created the issue
    const slackIntegrationAccount = await getSlackUserIntegrationAccount(
      this.prisma,
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
      attachments: await getIssueMessageModal(this.prisma, createdIssue),
      ...(sessionData.threadTs ? { thread_ts: sessionData.threadTs } : {}),
    };

    // Send the Slack message
    const messageResponse = await sendSlackMessage(integrationAccount, payload);

    if (messageResponse.ok) {
      // If the message was sent successfully, create an issue comment and link the issue
      const linkedIssueData = await createIssueCommentAndLinkIssue(
        this.prisma,
        messageResponse.message,
        sessionData,
        integrationAccount,
        createdIssue,
        userId,
      );

      // Update the issue with the linked issue data
      await this.issuesService.updateIssueApi(
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

  async handleThread(
    eventBody: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ): Promise<IssueComment> {
    // Get the message from the event body based on the subtype
    const message =
      eventBody.subtype === 'message_changed' ? eventBody.message : eventBody;

    if (message.username && message.username.includes('(via Tegon)')) {
      return undefined;
    }

    // Find the channel mapping in the integration account settings
    const channelMapping = (
      integrationAccount.settings as Settings
    ).Slack.channelMappings.find(
      ({ channelId: mappedChannelId }) => mappedChannelId === eventBody.channel,
    );
    // If no channel mapping is found, return undefined
    if (!channelMapping) {
      return undefined;
    }

    // Generate thread ID and parent thread ID
    const threadId = `${eventBody.channel}_${message.ts}`;
    const parentThreadId = `${eventBody.channel}_${message.thread_ts}`;

    this.logger.debug(`Handling Slack thread with ID: ${threadId}`);

    // Get the linked issue by the parent thread ID
    const linkedIssue =
      await this.linkedIssueService.getLinkedIssueBySourceId(parentThreadId);

    // If no linked issue is found, log and return undefined
    if (!linkedIssue) {
      this.logger.debug(
        `No linked issue found for Slack issue ID: ${parentThreadId}`,
      );
      return undefined;
    }

    // Extract issue ID and synced comment ID from the linked issue
    const { issueId, source: linkedIssueSource } = linkedIssue;
    const userId = message.user
      ? await getUserId(this.prisma, { id: message.user })
      : null;
    const parentId = (linkedIssueSource as Record<string, string>)
      .syncedCommentId;

    let displayName;
    if (message.user) {
      // Get the Slack user data if user ID is available
      const userData = await getExternalSlackUser(
        integrationAccount,
        message.user,
      );
      displayName = userData.user.real_name;
    }
    // Prepare source data for the linked comment
    const sourceMetadata = {
      idTs: message.ts,
      parentTs: message.thread_ts,
      channelId: eventBody.channel,
      channelType: eventBody.channel_type,
      type: IntegrationName.Slack,
      id: integrationAccount.id,
      userDisplayName: message.username ? message.username : displayName,
    };

    // Check if a linked comment already exists for the thread ID
    const linkedComment = await this.prisma.linkedComment.findFirst({
      where: { sourceId: threadId },
      include: { comment: true },
    });

    let attachmentUrls;
    if (message.files) {
      // Get the files buffer from Slack using the integration account and message files
      const multerFiles = await getFilesBuffer(
        integrationAccount,
        message.files,
      );

      // Upload the files to GCP and get the attachment URLs
      attachmentUrls = await this.attachmentService.uploadAttachment(
        multerFiles,
        userId,
        integrationAccount.workspaceId,
        sourceMetadata,
      );
    }

    const tiptapMessage = convertSlackMessageToTiptapJson(
      message.blocks,
      attachmentUrls,
    );

    if (linkedComment) {
      // If a linked comment exists, update the existing comment
      this.logger.debug(`Updating existing comment for thread ID: ${threadId}`);
      return this.prisma.issueComment.update({
        where: { id: linkedComment.commentId },
        data: { body: tiptapMessage },
      });
    }

    // If no linked comment exists, create a new comment
    this.logger.debug(`Creating new comment for thread ID: ${threadId}`);
    return this.prisma.issueComment.create({
      data: {
        body: tiptapMessage,
        issueId,
        userId,
        parentId,
        sourceMetadata,
        linkedComment: {
          create: {
            url: threadId,
            sourceId: threadId,
            source: { type: IntegrationName.Slack },
            sourceData: sourceMetadata,
          },
        },
      },
    });
  }

  async handleMessageReaction(
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
      this.logger.debug(`Ignoring reaction event with reaction: ${reaction}`);
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
      this.logger.debug(`The channel is not connected`);
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

    this.logger.debug(`Session data: ${JSON.stringify(sessionData)}`);

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
      this.prisma.linkedIssue.findFirst({
        where: {
          sourceId: `${channelId}_${slackMessageResponse.messages[0].thread_ts || threadTs}`,
        },
      }),
      Promise.all([
        getState(this.prisma, 'opened', sessionData.teamId),
        getUserId(this.prisma, { id: slackUserId }),
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

      this.logger.debug(
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
    if (slackMessageResponse.messages[0].files) {
      // Get the files buffer from Slack using the integration account and message files
      const multerFiles = await getFilesBuffer(
        integrationAccount,
        slackMessageResponse.messages[0].files,
      );
      // Upload the files to GCP and get the attachment URLs
      attachmentUrls = await this.attachmentService.uploadAttachment(
        multerFiles,
        userId,
        integrationAccount.workspaceId,
        sourceMetadata,
      );
    }

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

    this.logger.debug(
      `Creating Slack issue with data: ${JSON.stringify(issueData)}`,
    );

    // Create a new Slack issue using the integration account, session data, and issue data
    return await this.createSlackIssue(
      integrationAccount,
      sessionData,
      issueData,
    );
  }
}
