import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { TeamsController } from './teams.controller';
import TeamsService from './teams.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [TeamsController],
  providers: [TeamsService, PrismaService, UsersService],
  exports: [TeamsService],
})
export class TeamsModule {}
