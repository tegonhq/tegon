/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationDefinitionService } from 'modules/integration_definition/integration_definition.service';

import { IntegrationAccountController } from './integration_account.controller';
import { IntegrationAccountService } from './integration_account.service';

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
