/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationDefinition } from '@@generated/integrationDefinition/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  IntegrationDefinitionCreateBody,
  IntegrationDefinitionRequestIdBody,
  IntegrationDefinitionUpdateBody,
} from './integration_definition.interface';

@Injectable()
export class IntegrationDefinitionService {
  constructor(private prisma: PrismaService) {}

  async getIntegrationDefinitions(): Promise<IntegrationDefinition[]> {
    return await this.prisma.integrationDefinition.findMany({});
  }

  async getIntegrationDefinitionWithId(
    integrationDefinitionRequestIdBody: IntegrationDefinitionRequestIdBody,
  ): Promise<IntegrationDefinition> {
    return await this.prisma.integrationDefinition.findUnique({
      where: { id: integrationDefinitionRequestIdBody.integrationDefinitionId },
    });
  }

  async createIntegrationDefinition(
    integrationDefinitionCreateBody: IntegrationDefinitionCreateBody,
  ) {
    return await this.prisma.integrationDefinition.create({
      data: {
        ...integrationDefinitionCreateBody,
        spec: JSON.stringify(integrationDefinitionCreateBody.spec),
      },
    });
  }

  async updateIntegrationDefinition(
    integrationDefinitionUpdateBody: IntegrationDefinitionUpdateBody,
    integrationDefinitionId: string,
  ) {
    const { spec, ...otherIntegrationDefinitionBody } =
      integrationDefinitionUpdateBody;
    return await this.prisma.integrationDefinition.update({
      data: {
        ...otherIntegrationDefinitionBody,
        ...(spec ?? { spec: JSON.stringify(spec) }),
      },
      where: {
        id: integrationDefinitionId,
      },
    });
  }
}
