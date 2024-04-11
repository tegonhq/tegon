/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger } from '@nestjs/common';
import { IntegrationName, IssueComment } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';
import {
  CreateIssueInput,
  IssueRequestParams,
  IssueWithRelations,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { LinkIssueData } from 'modules/linked-issue/linked-issue.interface';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { OAuthCallbackService } from 'modules/oauth-callback/oauth-callback.service';

import {
  IntegrationAccountQueryParams,
  ModelViewType,
  SlashCommandSessionRecord,
} from './slack.interface';
import {
  getIssueData,
  getIssueMessageModal,
  getModalView,
  getSlackHeaders,
  getSlackUserIntegrationAccount,
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
  ) {}

  private readonly logger: Logger = new Logger('SlackService', {
    timestamp: true,
  });

  async handleEvents(eventBody: EventBody) {
    if (eventBody.type === 'url_verification') {
      return { challenge: eventBody.challenge };
    } else if (eventBody.event.type === 'message') {
      return await this.handleThread(eventBody.event);
    }
    return undefined;
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
    const { trigger_id: triggerId, token, message } = eventBody;

    const channelId = eventBody?.channel_id || eventBody.channel.id;

    const slackTeamId = eventBody?.team_id || eventBody.team.id;
    const teamDomain = eventBody?.team_domain || eventBody.team.domain;

    const integrationAccount = await this.prisma.integrationAccount.findFirst({
      where: { accountId: slackTeamId },
      include: { workspace: true, integrationDefinition: true },
    });

    const sessionData = {
      slackTeamId,
      channelId,
      IntegrationAccountId: integrationAccount.id,
      slackTeamDomain: teamDomain,
      threadTs: message?.ts || null,
      messageText: message?.text || null,
      messagedById: message?.user || null,
    };
    const { view, sessionData: updatedSessionData } = getModalView(
      integrationAccount,
      channelId,
      ModelViewType.CREATE,
      sessionData,
    );
    this.session[token] = updatedSessionData as SlashCommandSessionRecord;
    await postRequest(
      'https://slack.com/api/views.open',
      getSlackHeaders(integrationAccount),
      {
        trigger_id: triggerId,
        view,
      },
    );
  }

  async handleViewSubmission(token: string, payload: EventBody) {
    const { containsDescription, ...otherSessionData } = this.session[token];
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: { id: otherSessionData.IntegrationAccountId },
      include: { workspace: true, integrationDefinition: true },
    });

    if (!containsDescription) {
      const { view, sessionData } = getModalView(
        integrationAccount,
        otherSessionData.channelId,
        ModelViewType.UPDATE,
        otherSessionData,
        payload,
      );
      this.session[token] = sessionData as SlashCommandSessionRecord;
      return {
        response_action: 'update',
        view,
      };
    } else if (containsDescription) {
      this.createSlackIssue(integrationAccount, this.session[token], payload);
    }
    return {
      response_action: 'clear',
    };
  }

  async createSlackIssue(
    integrationAccount: IntegrationAccountWithRelations,
    sessionData: SlashCommandSessionRecord,
    eventBody: EventBody,
  ) {
    const { issueInput, userId, sourceMetadata } = await getIssueData(
      this.prisma,
      sessionData,
      eventBody,
      integrationAccount,
    );

    const createdIssue = await this.issuesService.createIssueAPI(
      { teamId: sessionData.teamId } as TeamRequestParams,
      issueInput as CreateIssueInput,
      userId,
      null,
      sourceMetadata,
    );

    const messageResponse = await this.sendIssueMessage(
      integrationAccount,
      sessionData.channelId,
      createdIssue,
      sessionData.threadTs,
    );

    if (messageResponse.data.ok) {
      const {
        ts: messageTs,
        thread_ts: parentTs,
        channel,
        channel_type,
      } = messageResponse.data.message;
      const commentBody = `${IntegrationName.Slack} thread in ${createdIssue.title}`;

      const issueComment = await this.prisma.issueComment.create({
        data: {
          body: commentBody,
          issueId: createdIssue.id,
          sourceMetadata: {
            idTs: messageTs,
            parentTs,
            channelId: channel,
            channelType: channel_type,
            type: IntegrationName.Slack,
          },
        },
      });

      const mainTs = parentTs || messageTs;
      const linkIssueData: LinkIssueData = {
        url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${mainTs.replace('.', '')}`,
        sourceId: `${sessionData.channelId}_${mainTs}`,
        source: {
          type: IntegrationName.Slack,
          syncedCommentId: issueComment.id,
        },
        sourceData: {
          channelId: sessionData.channelId,
          messageTs,
          parentTs,
          slackTeamDomain: sessionData.slackTeamDomain,
        },
        createdById: userId,
      };

      await this.issuesService.updateIssueApi(
        { teamId: sessionData.teamId } as TeamRequestParams,
        {} as UpdateIssueInput,
        { issueId: createdIssue.id } as IssueRequestParams,
        userId,
        linkIssueData,
        sourceMetadata,
      );
    }
  }

  async sendIssueMessage(
    integrationAccount: IntegrationAccountWithRelations,
    channelId: string,
    issue: IssueWithRelations,
    threadTs?: string,
  ) {
    const slackIntegrationAccount = await getSlackUserIntegrationAccount(
      this.prisma,
      issue.createdById,
      issue.team.workspaceId,
    );
    const response = await postRequest(
      'https://slack.com/api/chat.postMessage',
      getSlackHeaders(integrationAccount),
      {
        channel: channelId,
        text: `<@${slackIntegrationAccount.accountId}> created a Issue`,
        attachments: await getIssueMessageModal(this.prisma, issue),
        ...(threadTs ? { thread_ts: threadTs } : {}),
      },
    );

    return response;
  }

  async handleThread(eventBody: EventBody): Promise<IssueComment> {
    const message =
      eventBody.subtype === 'message_changed' ? eventBody.message : eventBody;
    const threadId = `${eventBody.channel}_${message.ts}`;
    const parentThreadId = `${eventBody.channel}_${message.thread_ts}`;

    const linkedIssue =
      await this.linkedIssueService.getLinkedIssueBySourceId(parentThreadId);

    if (!linkedIssue) {
      this.logger.debug(
        `No linked issue found for Slack issue ID: ${parentThreadId}`,
      );
      return undefined;
    }

    const { issueId, source: linkedIssueSource } = linkedIssue;
    const userId = message.user
      ? await getUserId(this.prisma, { id: message.user })
      : null;
    const parentId = (linkedIssueSource as Record<string, string>)
      .syncedCommentId;

    const sourceData = {
      idTs: message.ts,
      parentTs: message.thread_ts,
      channelId: eventBody.channel,
      channelType: eventBody.channel_type,
      type: IntegrationName.Slack,
      userDisplayName: message.username ? message.username : message.user,
    };

    const linkedComment = await this.prisma.linkedComment.findFirst({
      where: { sourceId: threadId },
      include: { comment: true },
    });

    if (linkedComment) {
      return this.prisma.issueComment.update({
        where: { id: linkedComment.commentId },
        data: { body: message.text },
      });
    }
    return this.prisma.issueComment.create({
      data: {
        body: message.text,
        issueId,
        userId,
        parentId,
        sourceMetadata: sourceData,
        linkedComment: {
          create: {
            url: threadId,
            sourceId: threadId,
            source: { type: IntegrationName.Slack },
            sourceData,
          },
        },
      },
    });
  }
}