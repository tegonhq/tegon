import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  IntegrationDefinition,
  WorkspaceRequestParamsDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  IntegrationDefinitionRequestIdBody,
  IntegrationDefinitionUpdateBody,
} from './integration-definition.interface';
import { IntegrationDefinitionService } from './integration-definition.service';

@Controller({
  version: '1',
  path: 'integration_definition',
})
@ApiTags('Integration Definition')
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
export class IntegrationDefinitionController {
  constructor(
    private integrationDefinitionService: IntegrationDefinitionService,
  ) {}

  /**
   * Get all integration definitions in a workspace
   */
  @Get()
  async getIntegrationDefinitionsByWorkspace(
    @Param()
    workspaceDto: WorkspaceRequestParamsDto,
  ) {
    return await this.integrationDefinitionService.getIntegrationDefinitions(
      workspaceDto.workspaceId,
    );
  }

  // /**
  //  * Get spec for integration definition
  //  */
  @Get(':integrationDefinitionId/spec')
  @UseGuards(AuthGuard)
  async getIntegrationDefinitionSpec(
    @Param()
    integrationDefinitionRequestIdBody: IntegrationDefinitionRequestIdBody,
  ) {
    const integrationDefinition =
      await this.integrationDefinitionService.getIntegrationDefinitionWithSpec(
        integrationDefinitionRequestIdBody.integrationDefinitionId,
      );

    return integrationDefinition.spec;
  }

  /**
   * Update a integration definition in a workspace
   */
  @Post(':integrationDefinitionId')
  async updateIntegrationDefinition(
    @Param()
    integrationDefinitionRequestIdBody: IntegrationDefinitionRequestIdBody,
    @Body()
    integrationDefinitionUpdateBody: IntegrationDefinitionUpdateBody,
  ): Promise<IntegrationDefinition> {
    return await this.integrationDefinitionService.updateIntegrationDefinition(
      integrationDefinitionUpdateBody,
      integrationDefinitionRequestIdBody.integrationDefinitionId,
    );
  }

  /**
   * Get a integration definition in a workspace
   */
  @Get(':integrationDefinitionId')
  async getIntegrationDefinitionWithId(
    @Param()
    integrationDefinitionRequestIdBody: IntegrationDefinitionRequestIdBody,
  ): Promise<IntegrationDefinition> {
    return await this.integrationDefinitionService.getIntegrationDefinitionWithId(
      integrationDefinitionRequestIdBody,
    );
  }
}
