import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TriggerdevModule } from 'modules/triggerdev/triggerdev.module';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';
import { UsersService } from 'modules/users/users.service';

import { IntegrationDefinitionController } from './integration-definition.controller';
import { IntegrationDefinitionService } from './integration-definition.service';

@Module({
  imports: [PrismaModule, TriggerdevModule],
  controllers: [IntegrationDefinitionController],
  providers: [
    PrismaService,
    IntegrationDefinitionService,
    TriggerdevService,
    UsersService,
  ],
  exports: [IntegrationDefinitionService],
})
export class IntegrationDefinitionModule {}
