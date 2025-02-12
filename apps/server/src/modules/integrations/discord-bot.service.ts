import { Injectable, OnModuleInit } from '@nestjs/common';
// To send the webhook
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Client, GatewayIntentBits } from 'discord.js';
import { PrismaService } from 'nestjs-prisma';

import { LoggerService } from 'modules/logger/logger.service';

@Injectable()
export class DiscordBotService implements OnModuleInit {
  private readonly logger = new LoggerService(DiscordBotService.name);

  private readonly client: Client;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
      ],
    });
  }

  async onModuleInit() {
    try {
      const integrationDefinition =
        await this.prisma.integrationDefinitionV2.findFirst({
          where: { slug: 'discord' },
        });

      if (integrationDefinition && integrationDefinition.config) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const integrationConfig = integrationDefinition.config as any;
        if (integrationConfig.botToken) {
          this.logger.info({
            message: `Logging into discord`,
            where: 'DiscordBotService.onModuleInit',
          });

          this.client.login(integrationConfig.botToken as string);
        }
      }

      this.client.on('ready', () => {
        this.logger.info({
          message: `Discord listener ready`,
          where: 'DiscordBotService.onModuleInit',
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.client.on('raw', async (packet: any) => {
        this.logger.info({
          message: `Received discord event`,
          where: 'DiscordBotService.onModuleInit',
          payload: { type: packet.t },
        });

        const url = `${this.config.get('FRONTEND_HOST')}/api/v1/webhook/discord`;

        axios.post(url, packet);
      });
    } catch (e) {
      console.log(e);
      this.logger.error({
        message: `Discord listener: ${e}`,
        where: 'DiscordBotService.onModuleInit',
      });
    }
  }
}
