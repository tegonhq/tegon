/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
    Controller,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';

  import WebhookService from './webhooks.service';
  
  @Controller({
    version: '1',
    path: 'workspaces',
  })
  @ApiTags('Workspaces')
  export class WebhookController {
    constructor(private webhookService: WebhookService) {}
  }
  