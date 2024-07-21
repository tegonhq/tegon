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
    { workspaceId, filters, teamId, name, description }: CreateViewsRequestBody,
    createdById: string,
  ) {
    return await this.prismaService.view.create({
      data: {
        name,
        // TODO should take normally without the any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: filters as any,
        workspace: { connect: { id: workspaceId } },
        team: { connect: { id: teamId } },
        isBookmarked: false,
        createdById,
        description: description ?? '',
      },
    });
  }

  async updateView(
    viewId: string,
    { filters, ...data }: UpdateViewsRequestBody,
  ) {
    return await this.prismaService.view.update({
      data: {
        ...data,
        // TODO should take normally without the any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: filters as any,
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
