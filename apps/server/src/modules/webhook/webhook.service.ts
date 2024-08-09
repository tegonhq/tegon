import { Injectable } from '@nestjs/common';
import {
  EventBody,
  EventHeaders,
  IntegrationPayloadEventType,
} from '@tegonhq/types';

import { pollTriggerRun, triggerTask } from 'common/utils/trigger.utils';

@Injectable()
export default class WebhookService {
  constructor() {}

  async handleEvents(
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    const handle = await triggerTask(`${sourceName}-handler`, {
      event: IntegrationPayloadEventType.Webhook,
      payload: {
        data: { eventBody, eventHeaders },
      },
    });
    const run = await pollTriggerRun(handle.id);
    return run.output;
  }
}
