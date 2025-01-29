import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import CompanyService from 'modules/company/company.service';
import PeopleService from 'modules/people/people.service';
import { UsersService } from 'modules/users/users.service';

import SupportService from './support.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    PrismaService,
    SupportService,
    UsersService,
    PeopleService,
    CompanyService,
  ],
  exports: [SupportService],
})
export class SupportModule {}
