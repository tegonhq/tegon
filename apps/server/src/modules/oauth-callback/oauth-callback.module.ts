import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationAccountModule } from 'modules/integration-account/integration-account.module';
import { IntegrationDefinitionService } from 'modules/integration-definition/integration-definition.service';
import { TriggerdevModule } from 'modules/triggerdev/triggerdev.module';

import { OAuthCallbackController } from './oauth-callback.controller';
import { OAuthCallbackService } from './oauth-callback.service';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

@Module({
  imports: [PrismaModule, TriggerdevModule, IntegrationAccountModule],
  controllers: [OAuthCallbackController],
  providers: [
    OAuthCallbackService,
    PrismaService,
    TriggerdevService,
    IntegrationDefinitionService,
  ],
  exports: [OAuthCallbackService],
})
export class OAuthCallbackModule {}
