/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TeamsController } from './teams.controller';
import TeamsService from './teams.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [TeamsController],
  providers: [TeamsService, PrismaService],
  exports: [TeamsService],
})
export class TeamsModule {}
