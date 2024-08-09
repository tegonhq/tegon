import { Injectable } from '@nestjs/common';
import {
  CreateLabelDto,
  Label,
  LabelRequestParamsDto,
  UpdateLabelDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { RequestIdParams } from './labels.interface';

@Injectable()
export default class LabelsService {
  constructor(private prisma: PrismaService) {}

  async createLabel(labelData: CreateLabelDto): Promise<Label> {
    return await this.prisma.label.upsert({
      where: {
        name_workspaceId: {
          name: labelData.name,
          workspaceId: labelData.workspaceId,
        },
      },
      update: { deleted: null, name: labelData.name, color: labelData.color },
      create: labelData,
    });
  }

  async getAllLabels(requestIdParams: RequestIdParams): Promise<Label[]> {
    const whereClause = {
      ...(requestIdParams.workspaceId && {
        workspaceId: requestIdParams.workspaceId,
        teamId: null,
      }),
      ...(requestIdParams.teamId && { teamId: requestIdParams.teamId }),
    };

    return await this.prisma.label.findMany({
      where: whereClause,
    });
  }

  async getLabel(LabelRequestIdParams: LabelRequestParamsDto): Promise<Label> {
    return await this.prisma.label.findUnique({
      where: {
        id: LabelRequestIdParams.labelId,
      },
      include: {
        group: true,
        labels: true,
      },
    });
  }

  async updateLabel(
    LabelRequestIdParams: LabelRequestParamsDto,
    labelData: UpdateLabelDto,
  ): Promise<Label> {
    return await this.prisma.label.update({
      data: {
        ...labelData,
      },
      where: {
        id: LabelRequestIdParams.labelId,
      },
    });
  }

  async deleteLabel(labelRequestIdParams: LabelRequestParamsDto) {
    const label = await this.prisma.label.update({
      where: {
        id: labelRequestIdParams.labelId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });

    await this.prisma.$executeRaw`
      UPDATE "Issue"
      SET "labelIds" = array_remove("labelIds", ${labelRequestIdParams.labelId})
      WHERE ${labelRequestIdParams.labelId} = ANY("labelIds")
    `;

    await this.prisma.$executeRaw`
    UPDATE "IssueHistory"
    SET "addedLabelIds" = array_remove("addedLabelIds", ${labelRequestIdParams.labelId}), 
    "removedLabelIds" = array_remove("removedLabelIds", ${labelRequestIdParams.labelId})
    WHERE ${labelRequestIdParams.labelId} = ANY("addedLabelIds") or ${labelRequestIdParams.labelId} = ANY("removedLabelIds")
    `;

    return label;
  }
}
