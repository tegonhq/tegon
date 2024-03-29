/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'modules/auth/auth.guard';

import { ApiTags } from '@nestjs/swagger';
import { SearchInputData } from './search.interface';
import SearchService from './search.service';

@Controller({
  version: '1',
  path: 'search',
})
@ApiTags('Search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async updateLabel(@Body() searchData: SearchInputData) {
    return await this.searchService.searchData(
      searchData.workspaceId,
      searchData.query,
      searchData.limit,
    );
  }
}
