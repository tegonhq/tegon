import { Body, Controller, Post, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GithubQueue } from './github.queue';
import { EventBody, EventHeaders } from '../integrations.interface';

@Controller({
  version: '1',
  path: 'github',
})
@ApiTags('Github')
export class GithubController {
  constructor(private githubQueue: GithubQueue) {}

  @Post()
  async githubEvents(
    @Headers() eventHeaders: EventHeaders,
    @Body() eventBody: EventBody,
  ) {
    return await this.githubQueue.handleEventsJob(eventHeaders, eventBody);
  }
}
