import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationDefinitionService } from 'modules/integration-definition/integration-definition.service';

import { IntegrationAccountController } from './integration-account.controller';
import { IntegrationAccountService } from './integration-account.service';

@Module({
  imports: [PrismaModule],
  controllers: [IntegrationAccountController],
  providers: [
    PrismaService,
    IntegrationAccountService,
    IntegrationDefinitionService,
  ],
  exports: [IntegrationAccountService],
})
export class IntegrationAccountModule {}
