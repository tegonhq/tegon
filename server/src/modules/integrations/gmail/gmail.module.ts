/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { AttachmentService } from 'modules/attachments/attachments.service';
import { IntegrationAccountService } from 'modules/integration-account/integration-account.service';
import { IssuesModule } from 'modules/issues/issues.module';
import { OAuthCallbackModule } from 'modules/oauth-callback/oauth-callback.module';

import { GmailController } from './gmail.controller';
import { GmailProcessor } from './gmail.processor';
import { GmailQueue } from './gmail.queue';
import GmailService from './gmail.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    OAuthCallbackModule,
    IssuesModule,
    BullModule.registerQueue({ name: 'gmail' }),
  ],
  controllers: [GmailController],
  providers: [
    PrismaService,
    GmailService,
    IntegrationAccountService,
    AttachmentService,
    GmailQueue,
    GmailProcessor,
  ],
  exports: [GmailService],
})
export class GmailModule {}
