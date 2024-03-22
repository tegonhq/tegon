/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Controller, Get, Param } from '@nestjs/common';

import { BullService } from './bull.service';

@Controller('bull')
export class BullController {
  constructor(private readonly bullService: BullService) {}

  @Get(':queueName/status')
  async getQueueStatus(@Param('queueName') queueName: string) {
    return this.bullService.getQueueStatus(queueName);
  }
}
