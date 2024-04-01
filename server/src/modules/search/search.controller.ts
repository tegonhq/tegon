/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'modules/auth/auth.guard';

import { SearchInputData } from './search.interface';
import SearchService from './search.service';

@Controller({
  version: '1',
  path: 'search',
})
@ApiTags('Search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async updateLabel(@Query() searchData: SearchInputData) {
    return await this.searchService.searchData(
      searchData.workspaceId,
      searchData.query,
      parseInt(searchData.limit),
    );
  }
}
