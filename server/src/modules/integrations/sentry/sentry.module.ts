import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaModule, PrismaService } from "nestjs-prisma";

import { IntegrationAccountService } from "modules/integration-account/integration-account.service";
import { OAuthCallbackModule } from "modules/oauth-callback/oauth-callback.module";

import { SentryController } from "./sentry.controller";
import SentryService from "./sentry.service";

@Module({
  imports: [PrismaModule, HttpModule, OAuthCallbackModule],
  controllers: [SentryController],
  providers: [PrismaService, SentryService, IntegrationAccountService],
  exports: [SentryService],
})
export class SentryModule {}
