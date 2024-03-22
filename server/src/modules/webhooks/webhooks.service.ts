/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';

import {
  WebhookEventBody,
  WebhookEventHeaders,
  WebhookEventParams,
} from './webhooks.interface';
import { GithubQueue } from 'modules/integrations/github/github.queue';

@Injectable()
export default class WebhookService {
  constructor(private githubQueue: GithubQueue) {}

  async handleEvents(
    webhookEventParams: WebhookEventParams,
    eventHeaders: WebhookEventHeaders,
    eventBody: WebhookEventBody,
  ) {
    switch (webhookEventParams.eventSource) {
      case 'github':
        // await this.githubService.handleEvents(eventHeaders, eventBody);
        this.githubQueue.handleEventsJob(eventHeaders, eventBody);
        break;
      default:
        console.warn(`Invalid event source ${webhookEventParams.eventSource}`);
    }
  }
}
