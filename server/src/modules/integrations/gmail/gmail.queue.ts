import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { EventBody } from '../integrations.interface';

@Injectable()
export class GmailQueue {
  constructor(@InjectQueue('gmail') private readonly gmailQueue: Queue) {}

  async handleEventsJob(eventBody: EventBody) {
    await this.gmailQueue.add('handleEvents', {
      eventBody,
    });
  }
}
