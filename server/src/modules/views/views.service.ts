/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateViewsRequestBody,
  UpdateViewsRequestBody,
} from './views.interface';

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
    { workspaceId, filters, ...data }: CreateViewsRequestBody,
    createdById: string,
  ) {
    return await this.prismaService.view.create({
      data: {
        ...data,
        // TODO should take normally without the any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: filters as any,
        workspace: { connect: { id: workspaceId } },
        isFavorite: false,
        createdById,
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
