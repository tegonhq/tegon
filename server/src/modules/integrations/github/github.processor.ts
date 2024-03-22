import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import {
  WebhookEventBody,
  WebhookEventHeaders,
} from 'modules/webhooks/webhooks.interface';
import GithubService from './github.service';

@Processor('github')
export class GithubProcessor {
  constructor(private githubService: GithubService) {}
  private readonly logger: Logger = new Logger('GithubProcessor');

  @Process('handleGithubEvents')
  async handleTwoWaySync(
    job: Job<{
      eventHeaders: WebhookEventHeaders;
      eventBody: WebhookEventBody;
    }>,
  ) {
    const { eventHeaders, eventBody } = job.data;
    this.logger.debug(
      `Handling two-way sync for github ${eventHeaders['x-github-event']} with action ${eventBody.action}`,
    );
    await this.githubService.handleEvents(eventHeaders, eventBody);
  }
}
