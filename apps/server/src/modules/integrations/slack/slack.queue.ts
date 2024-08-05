import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { IntegrationAccount } from '@tegonhq/types';
import { Queue } from 'bull';

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
    integrationAccount: IntegrationAccount,
  ) {
    await this.slackQueue.add('handleThread', {
      event,
      integrationAccount,
    });
  }

  async handleMessageReactionJob(
    event: EventBody,
    integrationAccount: IntegrationAccount,
  ) {
    await this.slackQueue.add('handleMessageReaction', {
      event,
      integrationAccount,
    });
  }
}
