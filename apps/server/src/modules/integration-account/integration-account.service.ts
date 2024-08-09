import { Injectable } from '@nestjs/common';
import {
  CreateIntegrationAccountDto,
  InputJsonValue,
  IntegrationAccountIdDto,
  IntegrationPayloadEventType,
  UpdateIntegrationAccountDto,
} from '@tegonhq/types';
import { tasks } from '@trigger.dev/sdk/v3';
import { PrismaService } from 'nestjs-prisma';

import { IntegrationAccountRequestBody } from './integration-account.interface';

@Injectable()
export class IntegrationAccountService {
  constructor(private prisma: PrismaService) {}

  async createIntegrationAccount(
    createIntegrationAccountBody: CreateIntegrationAccountDto,
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
        settings: createIntegrationAccountBody.settings,
      },
      include: {
        integrationDefinition: true,
        workspace: true,
      },
    });

    tasks.trigger(
      `${integrationAccount.integrationDefinition.name.toLowerCase()}-handler`,
      {
        integrationAccount,
        accesstoken: '',
        payload: { settingsData: settings },
        actionType: IntegrationPayloadEventType.IntegrationCreate,
      },
    );

    return integrationAccount;
  }

  async getIntegrationAccountWithId(
    integrationAccountRequestIdBody: IntegrationAccountIdDto,
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
    integrationAccountRequestIdBody: IntegrationAccountIdDto,
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

    tasks.trigger(
      `${integrationAccount.integrationDefinition.name.toLowerCase()}-internal`,
      {
        integrationAccount,
        accesstoken: '',
        actionType: IntegrationPayloadEventType.IntegrationDelete,
      },
    );

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
    updateIntegrationAccountBody: UpdateIntegrationAccountDto,
  ) {
    return await this.prisma.integrationAccount.update({
      data: {
        ...updateIntegrationAccountBody,
        settings: updateIntegrationAccountBody.settings as InputJsonValue,
      },
      where: {
        id: integrationAccountId,
      },
    });
  }

  async getIntegrationAccountByAccountId(accountId: string) {
    return await this.prisma.integrationAccount.findFirst({
      where: { accountId, deleted: null },
      include: { workspace: true, integrationDefinition: true },
    });
  }
}
