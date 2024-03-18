/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationAccountModule } from 'modules/integration_account/integration_account.module';
import { IntegrationDefinitionService } from 'modules/integration_definition/integration_definition.service';

import { OAuthCallbackController } from './oauth_callback.controller';
import { OAuthCallbackService } from './oauth_callback.service';

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
