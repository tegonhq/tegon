import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import CompanyService from 'modules/company/company.service';
import { UsersService } from 'modules/users/users.service';

import { PeopleController } from './people.controller';
import PeopleService from './people.service';

@Module({
  imports: [PrismaModule],
  controllers: [PeopleController],
  providers: [PrismaService, PeopleService, UsersService, CompanyService],
  exports: [PeopleService],
})
export class PeopleModule {}
