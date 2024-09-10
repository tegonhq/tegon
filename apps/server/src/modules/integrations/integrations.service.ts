import { join } from 'path';

import { Injectable } from '@nestjs/common';

import { LoggerService } from 'modules/logger/logger.service';

@Injectable()
export class IntegrationsService {
  private readonly logger = new LoggerService(IntegrationsService.name);

  constructor() {}

  //

  async loadIntegration(
    slug: string,
    payload: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    this.logger.info({
      message: `Loading integration ${slug}`,
      payload: { event: payload.event },
      where: 'IntegrationsService.loadIntegration',
    });

    try {
      // Dynamically build the path based on the slug (e.g., 'slack', 'github')
      const modulePath = join(__dirname, `../../integrations/${slug}`);

      // Dynamically import the module
      const integrationModule = await import(modulePath);

      // Call the default function exported by the module
      if (typeof integrationModule.default === 'function') {
        return integrationModule.default(payload); // Call the default function
      }

      return undefined;
    } catch (error) {
      console.error(`Failed to load integration for ${slug}:`, error);
    }
  }
}
