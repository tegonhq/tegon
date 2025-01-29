import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpsertCompanyDto } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Workspace } from 'modules/auth/session.decorator';

import CompanyService from './company.service';

@Controller({
  version: '1',
  path: 'company',
})
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCompany(
    @Body() data: UpsertCompanyDto,
    @Workspace() workspaceId: string,
  ) {
    return this.companyService.createCompany(data, workspaceId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCompanies(@Workspace() workspaceId: string) {
    return this.companyService.getCompanies(workspaceId);
  }

  @Get(':companyId')
  @UseGuards(AuthGuard)
  async getCompany(
    @Param('companyId') companyId: string,
    @Workspace() workspaceId: string,
  ) {
    return this.companyService.getCompany(companyId, workspaceId);
  }

  @Post(':companyId')
  @UseGuards(AuthGuard)
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() data: UpsertCompanyDto,
    @Workspace() workspaceId: string,
  ) {
    return this.companyService.updateCompany(companyId, data, workspaceId);
  }

  @Delete(':companyId')
  @UseGuards(AuthGuard)
  async deleteCompany(@Param('companyId') companyId: string) {
    return this.companyService.deleteCompany(companyId);
  }
}
