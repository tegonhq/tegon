import { IntegrationDefinition } from '@@generated/integrationDefinition/entities';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  IntegrationDefinitionCreateBody,
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
  async getIntegrationDefinitionsByWorkspace() {
    return await this.integrationDefinitionService.getIntegrationDefinitions();
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
  ) {
    return await this.integrationDefinitionService.updateIntegrationDefinition(
      integrationDefinitionUpdateBody,
      integrationDefinitionRequestIdBody.integrationDefinitionId,
    );
  }

  /**
   * Create a integration definition.
   * Used for custom integrations
   */
  @Post()
  @UseGuards(new AuthGuard())
  async createIntegrationDefinition(
    @Body()
    integrationDefinitionCreateBody: IntegrationDefinitionCreateBody,
  ): Promise<IntegrationDefinition> {
    return await this.integrationDefinitionService.createIntegrationDefinition(
      integrationDefinitionCreateBody,
    );
  }

  /**
   * Get a integration definition in a workspace
   */
  @Get(':integrationDefinitionId')
  async getIntegrationDefinitionWithId(
    @Param()
    integrationDefinitionRequestIdBody: IntegrationDefinitionRequestIdBody,
  ) {
    return await this.integrationDefinitionService.getIntegrationDefinitionWithId(
      integrationDefinitionRequestIdBody,
    );
  }
}
