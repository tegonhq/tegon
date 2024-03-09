/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';

import {
  WebhookEventBody,
  WebhookEventHeaders,
} from 'modules/webhooks/webhooks.interface';
import { handleIssues } from './github.utils';
import { PrismaService } from 'nestjs-prisma';
import IssuesService from 'modules/issues/issues.service';

@Injectable()
export default class GithubService {
  constructor(private prisma: PrismaService,
    private issuesService: IssuesService) {}

  async handleEvents(
    eventHeaders: WebhookEventHeaders,
    eventBody: WebhookEventBody,
  ) {
    const eventType = eventHeaders['x-github-event'];
    console.log(eventType);
    const integrationAccount = await this.prisma.integrationAccount.findFirst({
      where: { installationId: eventBody.installation.id },
    });
    switch (eventType) {
      case 'issues':
        handleIssues(this.prisma, this.issuesService, eventBody, integrationAccount);
        break;

      default:
        console.log(`couldn't find eventType ${eventType}`);
    }
  }
}
