import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { CompanyController } from './company.controller';
import CompanyService from './company.service';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [PrismaService, CompanyService, UsersService],
  exports: [CompanyService],
})
export class CompanyModule {}
