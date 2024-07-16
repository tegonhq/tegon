import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaModule, PrismaService } from "nestjs-prisma";

import { NotificationsModule } from "modules/notifications/notifications.module";

import { IssueRelationController } from "./issue-relation.controller";
import IssueRelationService from "./issue-relation.service";

@Module({
  imports: [PrismaModule, HttpModule, NotificationsModule],
  controllers: [IssueRelationController],
  providers: [IssueRelationService, PrismaService],
  exports: [IssueRelationService],
})
export class IssueRelationModule {}
