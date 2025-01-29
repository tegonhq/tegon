import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePersonDto, UpdatePersonDto } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Workspace } from 'modules/auth/session.decorator';

import PeopleService from './people.service';

@Controller({
  version: '1',
  path: 'people',
})
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPerson(
    @Body() data: CreatePersonDto,
    @Workspace() workspaceId: string,
  ) {
    return this.peopleService.createPerson(data, workspaceId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getPeople(@Query('companyId') companyId?: string) {
    return this.peopleService.getPeople(companyId);
  }

  @Get(':personId')
  @UseGuards(AuthGuard)
  async getPerson(@Param('personId') personId: string) {
    return this.peopleService.getPerson(personId);
  }

  @Post(':personId')
  @UseGuards(AuthGuard)
  async updatePerson(
    @Param('personId') personId: string,
    @Body() data: UpdatePersonDto,
  ) {
    return this.peopleService.updatePerson(personId, data);
  }

  @Delete(':personId')
  @UseGuards(AuthGuard)
  async deletePerson(@Param('personId') personId: string) {
    return this.peopleService.deletePerson(personId);
  }
}
