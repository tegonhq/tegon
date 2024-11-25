import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { IssuesModule } from 'modules/issues/issues.module';
import { UsersService } from 'modules/users/users.service';

import { CyclesController } from './cycles.controller';
import { CyclesService } from './cycles.service';

@Module({
  imports: [PrismaModule, IssuesModule],
  controllers: [CyclesController],
  providers: [CyclesService, UsersService],
  exports: [CyclesService],
})
export class CyclesModule {}
