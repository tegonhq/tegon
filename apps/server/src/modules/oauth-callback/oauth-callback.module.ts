import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationAccountModule } from 'modules/integration-account/integration-account.module';
import { IntegrationDefinitionService } from 'modules/integration-definition/integration-definition.service';
import { TriggerdevModule } from 'modules/triggerdev/triggerdev.module';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';
import { UsersService } from 'modules/users/users.service';

import { OAuthCallbackController } from './oauth-callback.controller';
import { OAuthCallbackService } from './oauth-callback.service';

@Module({
  imports: [PrismaModule, TriggerdevModule, IntegrationAccountModule],
  controllers: [OAuthCallbackController],
  providers: [
    OAuthCallbackService,
    PrismaService,
    TriggerdevService,
    UsersService,
    IntegrationDefinitionService,
  ],
  exports: [OAuthCallbackService],
})
export class OAuthCallbackModule {}
