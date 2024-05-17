/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';

import { EventBody } from '../integrations.interface';

@Injectable()
export class SlackQueue {
  constructor(@InjectQueue('slack') private readonly slackQueue: Queue) {}

  async handleEventsJob(integrationAccountId: string, channelId: string) {
    await this.slackQueue.add('addBotToChannel', {
      integrationAccountId,
      channelId,
    });
  }

  async handleThreadJob(
    event: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ) {
    await this.slackQueue.add('handleThread', {
      event,
      integrationAccount,
    });
  }

  async handleMessageReactionJob(
    event: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ) {
    await this.slackQueue.add('handleMessageReaction', {
      event,
      integrationAccount,
    });
  }
}
