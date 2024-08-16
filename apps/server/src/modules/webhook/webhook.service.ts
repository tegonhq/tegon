import { Injectable } from '@nestjs/common';
import { ActionTypesEnum, EventBody, EventHeaders } from '@tegonhq/types';

import { triggerTaskSync } from 'modules/triggerdev/triggerdev.utils';

@Injectable()
export default class WebhookService {
  constructor() {}

  async handleEvents(
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    return await triggerTaskSync(
      sourceName,
      {
        event: ActionTypesEnum.ExternalWebhook,
        payload: {
          eventBody,
          eventHeaders,
        },
      },
      'tr_dev_PZTillNmi7MkO4MghcNQ',
    );
  }
}
