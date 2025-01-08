import { Injectable } from '@nestjs/common';
import {
  CreateTemplateDto,
  Template,
  TemplateIdDto,
  UpdateTemplateDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { RequestIdParams } from './templates.interface';

@Injectable()
export default class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(
    userId: string,
    workspaceId: string,
    templateData: CreateTemplateDto,
  ): Promise<Template> {
    const template = await this.prisma.template.create({
      data: {
        ...templateData,
        workspaceId,
        createdById: userId,
      },
    });

    return template;
  }

  async getAllTemplates(requestIdParams: RequestIdParams): Promise<Template[]> {
    const whereClause = {
      ...(requestIdParams.workspaceId && {
        workspaceId: requestIdParams.workspaceId,
        teamId: null,
      }),
      ...(requestIdParams.teamId && { teamId: requestIdParams.teamId }),
    };

    return await this.prisma.template.findMany({
      where: whereClause,
    });
  }

  async getTemplate(templateRequestIdParams: TemplateIdDto): Promise<Template> {
    return await this.prisma.template.findUnique({
      where: {
        id: templateRequestIdParams.templateId,
      },
    });
  }

  async updateTemplate(
    templateRequestIdParams: TemplateIdDto,
    templateData: UpdateTemplateDto,
  ): Promise<Template> {
    return await this.prisma.template.update({
      data: {
        ...templateData,
      },
      where: {
        id: templateRequestIdParams.templateId,
      },
    });
  }

  async deleteTemplate(templateRequestIdParams: TemplateIdDto) {
    return await this.prisma.template.update({
      where: {
        id: templateRequestIdParams.templateId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });
  }
}
