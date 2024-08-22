import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { AIRequestsController } from './ai-requests.controller';
import AIRequestsService from './ai-requests.services';

@Module({
  imports: [PrismaModule],
  controllers: [AIRequestsController],
  providers: [PrismaService, AIRequestsService, UsersService],
  exports: [AIRequestsService],
})
export class AIRequestsModule {}
