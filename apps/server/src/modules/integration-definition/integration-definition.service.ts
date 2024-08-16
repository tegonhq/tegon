import { Injectable } from '@nestjs/common';
import {
  IntegrationDefinition,
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  TriggerdevService,
  TriggerProjects,
} from 'modules/triggerdev/triggerdev.service';

import {
  IntegrationDefinitionRequestIdBody,
  IntegrationDefinitionUpdateBody,
} from './integration-definition.interface';

@Injectable()
export class IntegrationDefinitionService {
  constructor(
    private prisma: PrismaService,
    private triggerdevService: TriggerdevService,
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
    integrationDefinitionRequestIdBody: IntegrationDefinitionRequestIdBody,
  ): Promise<IntegrationDefinition> {
    return await this.prisma.integrationDefinitionV2.findUnique({
      where: { id: integrationDefinitionRequestIdBody.integrationDefinitionId },
    });
  }

  async getIntegrationDefinitionWithSpec(
    integrationDefinitionId: string,
  ): Promise<IntegrationDefinition> {
    const integrationDefinition = await this.getIntegrationDefinitionWithId({
      integrationDefinitionId,
    });

    const payload: IntegrationEventPayload = {
      event: IntegrationPayloadEventType.SPEC,
    };

    const spec = await this.triggerdevService.triggerTask(
      TriggerProjects.Common,
      integrationDefinition.name,
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
