import { Module } from '@nestjs/common';

// import { DiscordBotService } from './discord-bot.service';
import { DiscordBotService } from './discord-bot.service';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [],
  controllers: [],
  providers: [IntegrationsService, DiscordBotService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
