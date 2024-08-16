import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PrismaService, UsersService],
  exports: [],
})
export class PromptsModule {}
