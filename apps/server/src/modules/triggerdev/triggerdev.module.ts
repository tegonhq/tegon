import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TriggerdevService } from './triggerdev.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [TriggerdevService, PrismaService],
  exports: [TriggerdevService],
})
export class TriggerdevModule {}
