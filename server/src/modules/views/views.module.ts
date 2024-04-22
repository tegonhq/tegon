/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  imports: [PrismaModule],
  controllers: [ViewsController],
  providers: [PrismaService, ViewsService],
  exports: [ViewsService],
})
export class ViewsModule {}
