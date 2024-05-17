/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';

import SlackService from './slack.service';
import { EventBody } from '../integrations.interface';

@Processor('slack')
export class SlackProcessor {
  constructor(private slackService: SlackService) {}
  private readonly logger: Logger = new Logger('SlackProcessor');

  @Process('handleThread')
  async handleThread(
    job: Job<{
      event: EventBody;
      integrationAccount: IntegrationAccountWithRelations;
    }>,
  ) {
    const { event, integrationAccount } = job.data;
    this.logger.debug(
      `Handling Slack thread for this Integration Account ${integrationAccount.id}`,
    );
    this.slackService.handleThread(event, integrationAccount);
  }

  @Process('handleMessageReaction')
  async handleMessageReaction(
    job: Job<{
      event: EventBody;
      integrationAccount: IntegrationAccountWithRelations;
    }>,
  ) {
    const { event, integrationAccount } = job.data;
    this.logger.debug(
      `Handling Slack message reaction for this Integration Account ${integrationAccount.id}`,
    );
    this.slackService.handleMessageReaction(event, integrationAccount);
  }
}
