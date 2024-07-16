import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationAccountModule } from 'modules/integration-account/integration-account.module';
import { IntegrationDefinitionService } from 'modules/integration-definition/integration-definition.service';

import { OAuthCallbackController } from './oauth-callback.controller';
import { OAuthCallbackService } from './oauth-callback.service';

@Module({
  imports: [PrismaModule, HttpModule, IntegrationAccountModule],
  controllers: [OAuthCallbackController],
  providers: [
    OAuthCallbackService,
    PrismaService,
    IntegrationDefinitionService,
  ],
  exports: [OAuthCallbackService],
})
export class OAuthCallbackModule {}
