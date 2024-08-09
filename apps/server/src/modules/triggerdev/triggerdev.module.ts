import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TriggerdevController } from './triggerdev.controller';
import { TriggerdevService } from './triggerdev.service';

@Module({
  imports: [PrismaModule],
  controllers: [TriggerdevController],
  providers: [TriggerdevService, PrismaService],
  exports: [TriggerdevService],
})
export class TriggerdevModule {}
