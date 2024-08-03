import { Injectable } from '@nestjs/common';
import { EventBody, EventHeaders } from '@tegonhq/types';
import { runs, tasks } from '@trigger.dev/sdk/v3';

@Injectable()
export default class WebhookService {
  constructor() {}

  async handleEvents(
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    const handle = await tasks.trigger(`${sourceName}-webhook`, {
      eventHeaders,
      eventBody,
    });

    const run = await runs.poll(handle.id);
    return run.output;
  }
}
