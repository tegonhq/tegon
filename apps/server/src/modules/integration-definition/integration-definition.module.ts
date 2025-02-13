import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationsModule } from 'modules/integrations/integrations.module';
import { TriggerdevModule } from 'modules/triggerdev/triggerdev.module';
import { UsersService } from 'modules/users/users.service';

import { IntegrationDefinitionController } from './integration-definition.controller';
import { IntegrationDefinitionService } from './integration-definition.service';

@Module({
  imports: [PrismaModule, TriggerdevModule, IntegrationsModule],
  controllers: [IntegrationDefinitionController],
  providers: [PrismaService, IntegrationDefinitionService, UsersService],
  exports: [IntegrationDefinitionService],
})
export class IntegrationDefinitionModule {}
