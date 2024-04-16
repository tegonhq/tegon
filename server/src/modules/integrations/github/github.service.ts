/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import IssuesService from 'modules/issues/issues.service';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import NotificationsService from 'modules/notifications/notifications.service';
import {
  WebhookEventBody,
  WebhookEventHeaders,
} from 'modules/webhooks/webhooks.interface';

import {
  handleInstallations,
  handleIssueComments,
  handleIssues,
  handlePullRequests,
  handleRepositories,
} from './github.handlers';
import { eventsToListen } from './github.interface';

@Injectable()
export default class GithubService {
  constructor(
    private prisma: PrismaService,
    private issuesService: IssuesService,
    private linkedIssueService: LinkedIssueService,
    private notificationsService: NotificationsService,
  ) {}
  private readonly logger: Logger = new Logger('GithubService', {
    timestamp: true,
  });

  async handleEvents(
    eventHeaders: WebhookEventHeaders,
    eventBody: WebhookEventBody,
  ) {
    const eventType = eventHeaders['x-github-event'];
    if (
      eventsToListen.has(eventType) &&
      !['tegon-bot[bot]', 'tegon-bot-dev[bot]'].includes(eventBody.sender.login)
    ) {
      const integrationAccount = await this.prisma.integrationAccount.findFirst(
        {
          where: { accountId: eventBody.installation.id.toString() },
          include: { workspace: true, integrationDefinition: true },
        },
      );
      if (!integrationAccount) {
        return undefined;
      }
      switch (eventType) {
        case 'issues':
          handleIssues(
            this.prisma,
            this.logger,
            this.linkedIssueService,
            this.issuesService,
            eventBody,
            integrationAccount,
          );

          break;

        case 'issue_comment':
          handleIssueComments(
            this.prisma,
            this.logger,
            this.linkedIssueService,
            this.notificationsService,
            eventBody,
            integrationAccount,
          );
          break;

        case 'pull_request':
          handlePullRequests(
            this.prisma,
            this.logger,
            this.issuesService,
            this.linkedIssueService,
            eventBody,
            integrationAccount,
          );
          break;

        case 'installation':
          handleInstallations(
            this.prisma,
            this.logger,
            eventBody,
            integrationAccount,
          );
          break;

        case 'installation_repositories':
          handleRepositories(
            this.prisma,
            this.logger,
            eventBody,
            integrationAccount,
          );
          break;

        default:
          console.warn(`couldn't find eventType ${eventType}`);
      }
    }
    return { status: 200, message: 'handled event successfully' };
  }
}
