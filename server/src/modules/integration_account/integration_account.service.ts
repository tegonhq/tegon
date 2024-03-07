/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateIntegrationAccountBody,
  IntegrationAccountRequestBody,
  IntegrationAccountRequestIdBody,
  UpdateIntegrationAccountBody,
} from './integration_account.interface';

@Injectable()
export class IntegrationAccountService {
  constructor(private prismaService: PrismaService) {}

  async createIntegrationAccount(
    createIntegrationAccountBody: CreateIntegrationAccountBody,
  ) {
    const { integrationDefinitionId, config, workspaceId } =
      createIntegrationAccountBody;

    const integrationAccount =
      await this.prismaService.integrationAccount.create({
        data: {
          integrationDefinition: { connect: { id: integrationDefinitionId } },
          workspace: { connect: { id: workspaceId } },
          integrationConfiguration: config,
          installationId: createIntegrationAccountBody.installationId
        },
        include: {
          integrationDefinition: true,
        },
      });

    return integrationAccount;
  }

  async getIntegrationAccountWithId(
    integrationAccountRequestIdBody: IntegrationAccountRequestIdBody,
  ) {
    return await this.prismaService.integrationAccount.findUnique({
      where: {
        id: integrationAccountRequestIdBody.integrationAccountId,
      },
      include: {
        integrationDefinition: true,
      },
    });
  }

  async deleteIntegrationAccount(
    integrationAccountRequestIdBody: IntegrationAccountRequestIdBody,
  ) {
    return await this.prismaService.integrationAccount.update({
      where: {
        id: integrationAccountRequestIdBody.integrationAccountId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });
  }

  async getIntegrationAccount(
    integrationAccountRequestBody: IntegrationAccountRequestBody,
  ) {
    const integrationAccount =
      await this.prismaService.integrationAccount.findUnique({
        where: {
          workspaceId: integrationAccountRequestBody.workspaceId,
          id: integrationAccountRequestBody.integrationAccountId,
        },
      });

    return integrationAccount;
  }

  async getIntegrationAccountsForWorkspace(workspaceId: string) {
    return await this.prismaService.integrationAccount.findMany({
      where: {
        workspace: {
          id: workspaceId,
        },
      },
      orderBy: [
        {
          updatedAt: 'asc',
        },
      ],
      include: {
        integrationDefinition: true,
      },
    });
  }

  async updateIntegrationAccount(
    integrationAccountId: string,
    updateIntegrationAccountBody: UpdateIntegrationAccountBody,
  ) {
    return await this.prismaService.integrationAccount.update({
      data: {
        integrationConfiguration: updateIntegrationAccountBody.config,
      },
      where: {
        id: integrationAccountId,
      },
    });
  }
}
