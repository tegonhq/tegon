/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Label } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateLabelInput,
  UpdateLabelInput,
  LabelRequestIdParams,
  RequestIdParams,
} from './labels.interface';

@Injectable()
export default class LabelsService {
  constructor(private prisma: PrismaService) {}

  async createLabel(
    labelData: CreateLabelInput,
  ): Promise<Label> {
    const label = await this.prisma.label.create({
      data: {
        ...labelData
      },
      include: {
        group: true
      },
    });

    return label;
  }

  async getAllLabels(requestIdParams: RequestIdParams): Promise<Label[]> {
    const whereClause = {
      ...(requestIdParams.workspaceId && { workspaceId: requestIdParams.workspaceId, teamId: null }),
      ...(requestIdParams.teamId && { teamId: requestIdParams.teamId }),
    };
  
    return await this.prisma.label.findMany({
      where: whereClause,
    });

  }

  async getLabel(
    LabelRequestIdParams: LabelRequestIdParams,
  ): Promise<Label> {
    return await this.prisma.label.findUnique({
      where: {
        id: LabelRequestIdParams.labelId,
      },
      include: {
        group: true,
        labels: true
      },
    });
  }

  async updateLabel(
    LabelRequestIdParams: LabelRequestIdParams,
    labelData: UpdateLabelInput,
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

  async deleteLabel(labelRequestIdParams: LabelRequestIdParams){
    return await this.prisma.label.delete({
      where: {
        id:
        labelRequestIdParams.labelId,
      },
    });
  }
}
