import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import { AuthGuard } from 'modules/auth/auth.guard';
import TemplatesService from './templates.service';
import {
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateRequestIdParams,
  RequestIdParams,
} from './templates.interface';
import { Template } from '@prisma/client';

@Controller({
  version: '1',
  path: 'templates',
})
@ApiTags('Templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createTemplate(
    @SessionDecorator() session: SessionContainer,
    @Body() templateData: CreateTemplateInput,
  ): Promise<Template> {
    const userId = session.getUserId();
    return await this.templatesService.createTemplate(userId, templateData);
  }

  @Get()
  @UseGuards(new AuthGuard())
  async getAllTemplates(
    @Query() requestParams: RequestIdParams,
  ): Promise<Template[]> {
    return await this.templatesService.getAllTemplates(requestParams);
  }

  @Get(':templateId')
  @UseGuards(new AuthGuard())
  async getTemplate(
    @Param()
    templateId: TemplateRequestIdParams,
  ): Promise<Template> {
    return await this.templatesService.getTemplate(templateId);
  }

  @Post(':templateId')
  @UseGuards(new AuthGuard())
  async updateTemplate(
    @Param()
    templateId: TemplateRequestIdParams,
    @Body() templateData: UpdateTemplateInput,
  ): Promise<Template> {
    return await this.templatesService.updateTemplate(
      templateId,
      templateData,
    );
  }

  @Delete(':templateId')
  @UseGuards(new AuthGuard())
  async deleteLabel(
    @Param()
    templateId: TemplateRequestIdParams,
  ): Promise<Template> {
    return await this.templatesService.deleteTemplate(
      templateId,
    );
  }
}
