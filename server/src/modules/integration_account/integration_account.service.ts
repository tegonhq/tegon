/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateIntegrationAccountBody,
  IntegrationAccountRequestBody,
  IntegrationAccountRequestIdBody,
  UpdateIntegrationAccountBody,
  UpdateIntegrationAccountSettingsBody,
} from './integration_account.interface';
import { storeIntegrationRelatedData } from './integration_account.utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntegrationAccountService {
  constructor(private prisma: PrismaService) {}

  async createIntegrationAccount(
    createIntegrationAccountBody: CreateIntegrationAccountBody,
  ) {
    const { integrationDefinitionId, config, workspaceId, userId } =
      createIntegrationAccountBody;

    const integrationAccount = await this.prisma.integrationAccount.create({
      data: {
        integrationDefinition: { connect: { id: integrationDefinitionId } },
        workspace: { connect: { id: workspaceId } },
        integrationConfiguration: config,
        accountId: createIntegrationAccountBody.accountId,
        integratedBy: { connect: { id: userId } },
      },
      include: {
        integrationDefinition: true,
        workspace: true,
      },
    });

    await storeIntegrationRelatedData(
      this.prisma,
      integrationAccount,
      integrationAccount.integrationDefinition.name,
      userId,
      workspaceId,
    );

    return integrationAccount;
  }

  async getIntegrationAccountWithId(
    integrationAccountRequestIdBody: IntegrationAccountRequestIdBody,
  ) {
    return await this.prisma.integrationAccount.findUnique({
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
    return await this.prisma.integrationAccount.update({
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
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: {
        workspaceId: integrationAccountRequestBody.workspaceId,
        id: integrationAccountRequestBody.integrationAccountId,
      },
    });

    return integrationAccount;
  }

  async getIntegrationAccountsForWorkspace(workspaceId: string) {
    return await this.prisma.integrationAccount.findMany({
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
    return await this.prisma.integrationAccount.update({
      data: {
        integrationConfiguration: updateIntegrationAccountBody.config,
      },
      where: {
        id: integrationAccountId,
      },
    });
  }

  async updateIntegrationAccountSettings(
    integrationAccountId: string,
    updateIntegrationAccountSettingsBody: UpdateIntegrationAccountSettingsBody,
  ) {
    return await this.prisma.integrationAccount.update({
      data: {
        settings:
          updateIntegrationAccountSettingsBody.settings as Prisma.JsonObject,
      },
      where: {
        id: integrationAccountId,
      },
    });
  }
}
