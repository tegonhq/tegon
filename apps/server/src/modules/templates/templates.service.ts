import { Injectable } from '@nestjs/common';
import { Template } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateRequestIdParams,
  RequestIdParams,
} from './templates.interface';

@Injectable()
export default class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(
    userId: string,
    templateData: CreateTemplateInput,
  ): Promise<Template> {
    const template = await this.prisma.template.create({
      data: {
        ...templateData,
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

  async getTemplate(
    TemplateRequestIdParams: TemplateRequestIdParams,
  ): Promise<Template> {
    return await this.prisma.template.findUnique({
      where: {
        id: TemplateRequestIdParams.templateId,
      },
    });
  }

  async updateTemplate(
    TemplateRequestIdParams: TemplateRequestIdParams,
    templateData: UpdateTemplateInput,
  ): Promise<Template> {
    return await this.prisma.template.update({
      data: {
        ...templateData,
      },
      where: {
        id: TemplateRequestIdParams.templateId,
      },
    });
  }

  async deleteTemplate(templateRequestIdParams: TemplateRequestIdParams) {
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
