/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { View } from '@@generated/view/entities';
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
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session } from 'modules/auth/session.decorator';

import {
  CreateViewsRequestBody,
  UpdateViewsRequestBody,
  ViewRequestIdBody,
  ViewsRequestBody,
} from './views.interface';
import { ViewsService } from './views.service';

@Controller({
  version: '1',
  path: 'views',
})
@ApiTags('Views')
@ApiBadRequestResponse({
  status: 400,
  type: 'string',
  description: 'Bad Request',
})
@ApiUnauthorizedResponse({
  status: 401,
  type: 'string',
  description: 'Not authorised',
})
export class ViewsController {
  constructor(private viewsService: ViewsService) {}

  /**
   * Get all views for the workspace
   */
  @Get()
  @UseGuards(new AuthGuard())
  async getViews(
    @Query()
    viewsRequestBody: ViewsRequestBody,
  ): Promise<View[]> {
    return await this.viewsService.getViews(viewsRequestBody.workspaceId);
  }

  /**
   * Get a view
   */
  @Get(':viewId')
  @UseGuards(new AuthGuard())
  async getViewById(
    @Param()
    viewRequestIdBody: ViewRequestIdBody,
  ): Promise<View> {
    return await this.viewsService.getViewById(viewRequestIdBody.viewId);
  }

  /**
   * Delete a View
   */
  @Delete(':view')
  @UseGuards(new AuthGuard())
  async deleteView(
    @Param()
    viewRequestIdBody: ViewRequestIdBody,
  ) {
    return await this.viewsService.deleteView(viewRequestIdBody.viewId);
  }

  /**
   * Update a view in workspace
   */
  @Post(':viewId')
  @UseGuards(new AuthGuard())
  async updateView(
    @Param()
    viewRequestIdBody: ViewRequestIdBody,
    @Body()
    updateViewBody: UpdateViewsRequestBody,
  ): Promise<View> {
    return await this.viewsService.updateView(
      viewRequestIdBody.viewId,
      updateViewBody,
    );
  }

  /**
   * Create view in a workspace
   */
  @Post()
  @UseGuards(new AuthGuard())
  async createView(
    @Session() session: SessionContainer,
    @Body()
    createViewBody: CreateViewsRequestBody,
  ): Promise<View> {
    const userId = session.getUserId();

    return await this.viewsService.createView(createViewBody, userId);
  }
}
