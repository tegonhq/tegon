/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('github')
export class GithubProcessor {
  constructor() {}
  private readonly logger: Logger = new Logger('SlackProcessor');

  @Process('handleGithubEvents')
  async handleTwoWaySync(
    job: Job<{
      integrationAccountId: string;
      channelId: string;
    }>,
  ) {
    const { integrationAccountId, channelId } = job.data;
    this.logger.debug(
      `Adding Tegon slack Bot to this channel ${channelId} for this Integration Account ${integrationAccountId}`,
    );
  }
}
