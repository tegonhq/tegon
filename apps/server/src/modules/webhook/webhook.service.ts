import { Injectable } from '@nestjs/common';
import { runs, tasks } from '@trigger.dev/sdk/v3';

import {
  EventBody,
  EventHeaders,
} from 'modules/integrations/integrations.interface';

@Injectable()
export default class WebhookService {
  constructor() {}

  async handleEvents(
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    console.log(sourceName, eventBody, eventHeaders);

    const handle = await tasks.trigger(`${sourceName}-webhook`, {
      eventHeaders,
      eventBody,
    });

    const run = await runs.poll(handle.id);
    return run.output;
  }
}
