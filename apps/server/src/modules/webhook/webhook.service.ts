import { Injectable } from '@nestjs/common';
import { EventBody, EventHeaders } from '@tegonhq/types';

import { pollTriggerRun, triggerTask } from 'common/utils/trigger.utils';

@Injectable()
export default class WebhookService {
  constructor() {}

  async handleEvents(
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    const { data: handle } = await triggerTask(`${sourceName}-webhook`, {
      eventHeaders,
      eventBody,
    });
    const { data: run } = await pollTriggerRun(handle.id);
    return run.output;
  }
}
