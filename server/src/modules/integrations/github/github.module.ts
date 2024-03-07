/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [],
  providers: [PrismaService],
  exports: [],
})
export class GithubModule {}
