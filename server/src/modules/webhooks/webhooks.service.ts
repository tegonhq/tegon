/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';

import GithubService from 'modules/integrations/github/github.service';

import {
  WebhookEventBody,
  WebhookEventHeaders,
  WebhookEventParams,
} from './webhooks.interface';

@Injectable()
export default class WebhookService {
  constructor(private githubService: GithubService) {}

  async handleEvents(
    webhookEventParams: WebhookEventParams,
    eventHeaders: WebhookEventHeaders,
    eventBody: WebhookEventBody,
  ) {
    switch (webhookEventParams.eventSource) {
      case 'github':
        await this.githubService.handleEvents(eventHeaders, eventBody);
        break;
      default:
        console.log(`Invalid event source ${webhookEventParams.eventSource}`);
    }
  }
}
