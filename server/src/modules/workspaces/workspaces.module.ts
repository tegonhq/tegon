/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { WorkspacesController } from './workspaces.controller';
import WorkspacesService from './workspaces.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, PrismaService, UsersService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
