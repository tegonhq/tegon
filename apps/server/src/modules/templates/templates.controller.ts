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
import {
  CreateTemplateDto,
  Template,
  TemplateIdDto,
  UpdateTemplateDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { UserId, Workspace } from 'modules/auth/session.decorator';

import { RequestIdParams } from './templates.interface';
import TemplatesService from './templates.service';

@Controller({
  version: '1',
  path: 'templates',
})
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTemplate(
    @UserId() userId: string,
    @Workspace() workspaceId: string,
    @Body() templateData: CreateTemplateDto,
  ): Promise<Template> {
    return await this.templatesService.createTemplate(
      userId,
      workspaceId,
      templateData,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllTemplates(
    @Query() requestParams: RequestIdParams,
  ): Promise<Template[]> {
    return await this.templatesService.getAllTemplates(requestParams);
  }

  @Get(':templateId')
  @UseGuards(AuthGuard)
  async getTemplate(
    @Param()
    templateId: TemplateIdDto,
  ): Promise<Template> {
    return await this.templatesService.getTemplate(templateId);
  }

  @Post(':templateId')
  @UseGuards(AuthGuard)
  async updateTemplate(
    @Param()
    templateId: TemplateIdDto,
    @Body() templateData: UpdateTemplateDto,
  ): Promise<Template> {
    return await this.templatesService.updateTemplate(templateId, templateData);
  }

  @Delete(':templateId')
  @UseGuards(AuthGuard)
  async deleteLabel(
    @Param()
    templateId: TemplateIdDto,
  ): Promise<Template> {
    return await this.templatesService.deleteTemplate(templateId);
  }
}
