import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { IntegrationAccountModule } from 'modules/integration-account/integration-account.module';
import { IntegrationDefinitionModule } from 'modules/integration-definition/integration-definition.module';
import { IntegrationsModule } from 'modules/integrations/integrations.module';
import { UsersService } from 'modules/users/users.service';

import { OAuthCallbackController } from './oauth-callback.controller';
import { OAuthCallbackService } from './oauth-callback.service';

@Module({
  imports: [
    PrismaModule,
    IntegrationAccountModule,
    IntegrationDefinitionModule,
    IntegrationsModule,
  ],
  controllers: [OAuthCallbackController],
  providers: [OAuthCallbackService, UsersService],
  exports: [OAuthCallbackService],
})
export class OAuthCallbackModule {}
