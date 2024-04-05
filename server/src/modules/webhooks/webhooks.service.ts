/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';

import { GithubQueue } from 'modules/integrations/github/github.queue';

import {
  WebhookEventBody,
  WebhookEventHeaders,
  WebhookEventParams,
} from './webhooks.interface';

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
      case 'slack':
        if (eventBody.type === 'url_verification') {
          return { challenge: eventBody.challenge };
        }
        break;
      default:
        console.warn(`Invalid event source ${webhookEventParams.eventSource}`);
    }
    return { status: 200 };
  }
}
