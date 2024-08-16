import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';
import { VectorModule } from 'modules/vector/vector.module';

import { SearchController } from './search.controller';
import SearchService from './search.service';

@Module({
  imports: [PrismaModule, HttpModule, VectorModule],
  controllers: [SearchController],
  providers: [SearchService, UsersService],
  exports: [],
})
export class SearchModule {}
