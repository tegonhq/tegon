import { Module } from '@nestjs/common';

// import { DiscordBotService } from './discord-bot.service';
import { UsersService } from 'modules/users/users.service';

import { DiscordBotService } from './discord-bot.service';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [],
  controllers: [],
  providers: [IntegrationsService, DiscordBotService, UsersService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
