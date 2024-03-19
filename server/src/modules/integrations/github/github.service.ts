/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import IssuesService from 'modules/issues/issues.service';
import {
  WebhookEventBody,
  WebhookEventHeaders,
} from 'modules/webhooks/webhooks.interface';

import { eventsToListen } from './github.interface';
import {
  handleInstallations,
  handleIssueComments,
  handleIssues,
  handlePullRequests,
  handleRepositories,
} from './github.utils';

@Injectable()
export default class GithubService {
  constructor(
    private prisma: PrismaService,
    private issuesService: IssuesService,
  ) {}

  async handleEvents(
    eventHeaders: WebhookEventHeaders,
    eventBody: WebhookEventBody,
  ) {
    const eventType = eventHeaders['x-github-event'];
    if (
      eventsToListen.has(eventType) &&
      eventBody.sender.login !== 'tegon-bot[bot]'
    ) {
      const integrationAccount = await this.prisma.integrationAccount.findFirst(
        {
          where: { accountId: eventBody.installation.id.toString() },
          include: { workspace: true, integrationDefinition: true },
        },
      );
      switch (eventType) {
        case 'issues':
          handleIssues(
            this.prisma,
            this.issuesService,
            eventBody,
            integrationAccount,
          );

          break;

        case 'issue_comment':
          handleIssueComments(this.prisma, eventBody, integrationAccount);
          break;

        case 'pull_request':
          handlePullRequests(
            this.prisma,
            this.issuesService,
            eventBody,
            integrationAccount,
          );
          break;

        case 'installation':
          handleInstallations(this.prisma, eventBody, integrationAccount);
          break;

        case 'installation_repositories':
          handleRepositories(this.prisma, eventBody, integrationAccount);
          break;

        default:
          console.warn(`couldn't find eventType ${eventType}`);
      }
    }
  }
}
