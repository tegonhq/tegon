import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IntegrationAccountWithRelations } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateIntegrationAccountBody,
  IntegrationAccountRequestBody,
  IntegrationAccountRequestIdBody,
  UpdateIntegrationAccountBody,
} from './integration-account.interface';
import {
  handleAppDeletion,
  storeIntegrationRelatedData,
} from './integration-account.utils';

@Injectable()
export class IntegrationAccountService {
  constructor(private prisma: PrismaService) {}

  async createIntegrationAccount(
    createIntegrationAccountBody: CreateIntegrationAccountBody,
  ) {
    const { integrationDefinitionId, config, workspaceId, userId, settings } =
      createIntegrationAccountBody;

    const integrationAccount = await this.prisma.integrationAccount.upsert({
      where: {
        accountId_integrationDefinitionId_workspaceId: {
          accountId: createIntegrationAccountBody.accountId,
          workspaceId,
          integrationDefinitionId,
        },
      },
      update: {
        integrationConfiguration: config,
        deleted: null,
        isActive: true,
      },
      create: {
        integrationDefinition: { connect: { id: integrationDefinitionId } },
        workspace: { connect: { id: workspaceId } },
        integrationConfiguration: config,
        accountId: createIntegrationAccountBody.accountId,
        integratedBy: { connect: { id: userId } },
        isActive: true,
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
      settings,
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
    const integrationAccount = await this.prisma.integrationAccount.update({
      where: {
        id: integrationAccountRequestIdBody.integrationAccountId,
      },
      data: {
        deleted: new Date().toISOString(),
        isActive: false,
      },
      include: {
        integrationDefinition: true,
        workspace: true,
      },
    });

    await handleAppDeletion(integrationAccount);

    return integrationAccount;
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
        ...updateIntegrationAccountBody,
        settings:
          updateIntegrationAccountBody.settings as Prisma.InputJsonValue,
      },
      where: {
        id: integrationAccountId,
      },
    });
  }

  async getIntegrationAccountByAccountId(
    accountId: string,
  ): Promise<IntegrationAccountWithRelations> {
    return await this.prisma.integrationAccount.findFirst({
      where: { accountId, deleted: null },
      include: { workspace: true, integrationDefinition: true },
    });
  }
}
