import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { TemplatesController } from './templates.controller';
import TemplatesService from './templates.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, PrismaService, UsersService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
