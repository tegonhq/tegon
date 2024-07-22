import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import AIRequestsService from './ai-requests.services';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PrismaService, AIRequestsService],
  exports: [AIRequestsService],
})
export class AIRequestsModule {}
