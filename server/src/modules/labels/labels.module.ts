/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import LabelsService from './labels.service';
import { LabelsController } from './labels.controller';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LabelsController],
  providers: [LabelsService, PrismaService],
  exports: [LabelsService],
})
export class LabelsModule {}
