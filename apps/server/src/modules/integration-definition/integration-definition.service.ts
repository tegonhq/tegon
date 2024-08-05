import { Injectable } from '@nestjs/common';
import { IntegrationDefinition } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  IntegrationDefinitionRequestIdBody,
  IntegrationDefinitionUpdateBody,
} from './integration-definition.interface';

@Injectable()
export class IntegrationDefinitionService {
  constructor(private prisma: PrismaService) {}

  async getIntegrationDefinitions(): Promise<IntegrationDefinition[]> {
    return (await this.prisma.integrationDefinition.findMany(
      {},
    )) as IntegrationDefinition[];
  }

  async getIntegrationDefinitionWithId(
    integrationDefinitionRequestIdBody: IntegrationDefinitionRequestIdBody,
  ): Promise<IntegrationDefinition> {
    return await this.prisma.integrationDefinition.findUnique({
      where: { id: integrationDefinitionRequestIdBody.integrationDefinitionId },
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
