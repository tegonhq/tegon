import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { ConversationHistoryController } from './conversation-history.controller';
import { ConversationHistoryService } from './conversation-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConversationHistoryController],
  providers: [ConversationHistoryService, UsersService],
  exports: [ConversationHistoryService],
})
export class ConversationHistoryModule {}
