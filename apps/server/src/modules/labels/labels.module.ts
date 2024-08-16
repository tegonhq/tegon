import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { LabelsController } from './labels.controller';
import LabelsService from './labels.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LabelsController],
  providers: [LabelsService, PrismaService, UsersService],
  exports: [LabelsService],
})
export class LabelsModule {}
