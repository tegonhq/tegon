/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TemplatesController } from './templates.controller';
import TemplatesService from './templates.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, PrismaService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
