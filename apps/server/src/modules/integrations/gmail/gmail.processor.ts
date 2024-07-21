import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import GmailService from './gmail.service';
import { EventBody } from '../integrations.interface';

@Processor('gmail')
export class GmailProcessor {
  constructor(private gmailService: GmailService) {}
  private readonly logger: Logger = new Logger('GmailProcessor');

  @Process('handleEvents')
  async handleEvents(
    job: Job<{
      eventBody: EventBody;
    }>,
  ) {
    const { eventBody } = job.data;
    this.logger.debug(`Handling Gmail thread`);

    await this.gmailService.handleEvents(eventBody);
  }
}
