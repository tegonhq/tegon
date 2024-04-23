/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import {
  CreateViewsRequestBody,
  UpdateViewsRequestBody,
} from './views.interface';
import { getViewNameDescription } from './views.utils';

const openaiClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

@Injectable()
export class ViewsService {
  constructor(private prismaService: PrismaService) {}

  async getViews(workspaceId: string) {
    return await this.prismaService.view.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async createView(
    { workspaceId, filters }: CreateViewsRequestBody,
    createdById: string,
  ) {
    const { name, description } = await getViewNameDescription(openaiClient, {
      filters,
    } as CreateViewsRequestBody);
    return await this.prismaService.view.create({
      data: {
        name,
        // TODO should take normally without the any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: filters as any,
        workspace: { connect: { id: workspaceId } },
        isFavorite: false,
        createdById,
        description: description ?? '',
      },
    });
  }

  async updateView({ viewId, filters, ...data }: UpdateViewsRequestBody) {
    return await this.prismaService.view.update({
      data: {
        ...data,
        // TODO should take normally without the any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: filters as any,
        isFavorite: false,
      },
      where: {
        id: viewId,
      },
    });
  }

  async getViewById(viewId: string) {
    return await this.prismaService.view.findUnique({
      where: {
        id: viewId,
      },
    });
  }

  async deleteView(viewId: string) {
    return await this.prismaService.view.delete({
      where: {
        id: viewId,
      },
    });
  }
}
