import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaModule, PrismaService } from "nestjs-prisma";

import { LabelsController } from "./labels.controller";
import LabelsService from "./labels.service";

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LabelsController],
  providers: [LabelsService, PrismaService],
  exports: [LabelsService],
})
export class LabelsModule {}
