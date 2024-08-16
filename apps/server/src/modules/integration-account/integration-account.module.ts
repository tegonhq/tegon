import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationDefinitionService } from 'modules/integration-definition/integration-definition.service';
import { TriggerdevModule } from 'modules/triggerdev/triggerdev.module';
import { UsersService } from 'modules/users/users.service';

import { IntegrationAccountController } from './integration-account.controller';
import { IntegrationAccountService } from './integration-account.service';

@Module({
  imports: [PrismaModule, TriggerdevModule],
  controllers: [IntegrationAccountController],
  providers: [
    PrismaService,
    IntegrationAccountService,
    IntegrationDefinitionService,
    UsersService,
  ],
  exports: [IntegrationAccountService],
})
export class IntegrationAccountModule {}
