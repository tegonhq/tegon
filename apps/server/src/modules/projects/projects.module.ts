import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { IssuesModule } from 'modules/issues/issues.module';
import { UsersService } from 'modules/users/users.service';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [PrismaModule, IssuesModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
