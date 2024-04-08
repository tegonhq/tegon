/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SlackQueue {
  constructor(@InjectQueue('slack') private readonly slackQueue: Queue) {}

  async handleEventsJob(integrationAccountId: string, channelId: string) {
    await this.slackQueue.add('addBotToChannel', {
      integrationAccountId,
      channelId,
    });
  }
}
