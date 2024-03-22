import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  WebhookEventBody,
  WebhookEventHeaders,
} from 'modules/webhooks/webhooks.interface';

@Injectable()
export class GithubQueue {
  constructor(@InjectQueue('github') private readonly githubQueue: Queue) {}

  async handleEventsJob(
    eventHeaders: WebhookEventHeaders,
    eventBody: WebhookEventBody,
  ) {
    await this.githubQueue.add('handleGithubEvents', {
      eventHeaders,
      eventBody,
    });
  }
}
