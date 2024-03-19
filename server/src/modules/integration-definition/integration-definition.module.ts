/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationDefinitionController } from './integration-definition.controller';
import { IntegrationDefinitionService } from './integration-definition.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [IntegrationDefinitionController],
  providers: [PrismaService, IntegrationDefinitionService],
  exports: [IntegrationDefinitionService],
})
export class IntegrationDefinitionModule {}
