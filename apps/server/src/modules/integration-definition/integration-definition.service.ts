import { Injectable } from '@nestjs/common';
import {
  IntegrationDefinition,
  IntegrationDefinitionIdDto,
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { IntegrationsService } from 'modules/integrations/integrations.service';

import { IntegrationDefinitionUpdateBody } from './integration-definition.interface';

@Injectable()
export class IntegrationDefinitionService {
  constructor(
    private prisma: PrismaService,
    private integrations: IntegrationsService,
  ) {}

  async getIntegrationDefinitions(
    workspaceId: string,
  ): Promise<IntegrationDefinition[]> {
    return await this.prisma.integrationDefinitionV2.findMany({
      where: {
        OR: [
          {
            workspaceId: null,
          },
          {
            workspaceId,
          },
        ],
      },
    });
  }

  async getIntegrationDefinitionWithId(
    integrationDefinitionRequestIdBody: IntegrationDefinitionIdDto,
  ): Promise<IntegrationDefinition> {
    return await this.prisma.integrationDefinitionV2.findUnique({
      where: { id: integrationDefinitionRequestIdBody.integrationDefinitionId },
    });
  }

  async getIntegrationDefinitionWithSlug(
    slug: string,
    workspaceId: string,
  ): Promise<IntegrationDefinition> {
    return await this.prisma.integrationDefinitionV2.findFirst({
      where: { AND: { slug, workspaceId } },
    });
  }

  async getIntegrationDefinitionWithSpec(
    integrationDefinitionId?: string,
  ): Promise<IntegrationDefinition> {
    const integrationDefinition = await this.getIntegrationDefinitionWithId({
      integrationDefinitionId,
    });

    const payload: IntegrationEventPayload = {
      event: IntegrationPayloadEventType.SPEC,
    };

    const spec = await this.integrations.loadIntegration(
      integrationDefinition.slug,
      payload,
    );

    return { ...integrationDefinition, spec };
  }

  async updateIntegrationDefinition(
    integrationDefinitionUpdateBody: IntegrationDefinitionUpdateBody,
    integrationDefinitionId: string,
  ) {
    integrationDefinitionUpdateBody;
    return await this.prisma.integrationDefinitionV2.update({
      data: integrationDefinitionUpdateBody,
      where: {
        id: integrationDefinitionId,
      },
    });
  }
}
