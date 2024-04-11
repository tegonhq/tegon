/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, OnModuleInit } from '@nestjs/common';
import { IntegrationName } from '@prisma/client';
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
import { OAuthCallbackService } from 'modules/oauth-callback/oauth-callback.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';

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
import { postRequest } from '../integrations.utils';

@Injectable()
export default class SlackService implements OnModuleInit {
  // TODO(Manoj): Move this to Redis once we have multiple servers
  session: Record<string, SlashCommandSessionRecord> = {};
  constructor(
    private prisma: PrismaService,
    private oauthCallbackService: OAuthCallbackService,
    private issuesService: IssuesService,
  ) {}

  async onModuleInit() {
    const issue = await this.prisma.issue.findUnique({
      where: { id: 'e3645432-3f52-45c6-8c8c-99226e54d4ae' },
      include: { team: true },
    });
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: { id: '75184002-fc4e-49c3-89f2-6fc1ad60e269' },
      include: { workspace: true, integrationDefinition: true },
    });
    console.log(issue.id, integrationAccount.id);
    // this.sendIssueMessage(integrationAccount, 'C06SRE02QSJ', issue);
  }
  async handleEvents(eventBody: WebhookEventBody) {
    if (eventBody.type === 'url_verification') {
      return { challenge: eventBody.challenge };
    }
    console.log(eventBody);
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

  async slashOpenModal(
    slackTeamId: string,
    channelId: string,
    triggerId: string,
    token: string,
    teamDomain: string,
  ) {
    const integrationAccount = await this.prisma.integrationAccount.findFirst({
      where: { accountId: slackTeamId },
      include: { workspace: true, integrationDefinition: true },
    });
    const { view, sessionData } = getModalView(
      integrationAccount,
      channelId,
      ModelViewType.CREATE,
    );
    this.session[token] = {
      slackTeamId,
      channelId,
      IntegrationAccountId: integrationAccount.id,
      slackTeamDomain: teamDomain,
      ...sessionData,
    };
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
        payload,
      );
      this.session[token] = {
        ...otherSessionData,
        ...sessionData,
      };
      return {
        response_action: 'update',
        view,
      };
    } else if (containsDescription) {
      this.createSlackIssue(integrationAccount, this.session[token], payload);
      console.log(payload);
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
    const issueData = await getIssueData(
      this.prisma,
      sessionData,
      eventBody,
      integrationAccount,
    );

    const createdIssue = await this.issuesService.createIssueAPI(
      { teamId: sessionData.teamId } as TeamRequestParams,
      issueData.issueInput as CreateIssueInput,
      issueData.userId,
      null,
      issueData.sourceMetadata,
    );

    const messageResponse = await this.sendIssueMessage(
      integrationAccount,
      sessionData.channelId,
      createdIssue,
    );

    if (messageResponse.data.ok) {
      const commentBody = `${IntegrationName.Slack} thread in ${createdIssue.title}`;
      const issueComment = await this.prisma.issueComment.create({
        data: {
          body: commentBody,
          issueId: createdIssue.id,
          sourceMetadata: issueData.sourceMetadata,
        },
      });

      const messageTs = messageResponse.data.message.ts;
      const linkIssueData: LinkIssueData = {
        url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${messageTs.replace('.', '')}`,
        sourceId: `${sessionData.channelId}_${messageTs}`,
        source: {
          type: IntegrationName.Slack,
          syncedCommentId: issueComment.id,
        },
        sourceData: {
          channelId: sessionData.channelId,
          messageTs,
          slackTeamDomain: sessionData.slackTeamDomain,
        },
        createdById: issueData.userId,
      };

      this.issuesService.updateIssueApi(
        { teamId: sessionData.teamId } as TeamRequestParams,
        {} as UpdateIssueInput,
        { issueId: createdIssue.id } as IssueRequestParams,
        issueData.userId,
        linkIssueData,
        issueData.sourceMetadata,
      );
    }
  }

  async sendIssueMessage(
    integrationAccount: IntegrationAccountWithRelations,
    channelId: string,
    issue: IssueWithRelations,
  ) {
    const slackIntegrationAccount = await getSlackUserIntegrationAccount(
      this.prisma,
      issue.createdById,
      issue.team.workspaceId,
    );
    console.log(await getIssueMessageModal(this.prisma, issue));
    const response = await postRequest(
      'https://slack.com/api/chat.postMessage',
      getSlackHeaders(integrationAccount),
      {
        channel: channelId,
        text: `<@${slackIntegrationAccount.accountId}> created a Issue`,
        attachments: await getIssueMessageModal(this.prisma, issue),
      },
    );
    console.log(JSON.stringify(response));

    return response;
  }
}
