import { Injectable } from '@nestjs/common';
import {
  InputJsonValue,
  IntegrationAccountIdDto,
  PersonalAccountDto,
  UpdateIntegrationAccountDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  IntegrationAccountRequestBody,
  IntegrationAccountSelect,
} from './integration-account.interface';

@Injectable()
export class IntegrationAccountService {
  constructor(private prisma: PrismaService) {}

  async getIntegrationAccountWithId(
    integrationAccountRequestIdBody: IntegrationAccountIdDto,
  ) {
    return await this.prisma.integrationAccount.findUnique({
      where: {
        id: integrationAccountRequestIdBody.integrationAccountId,
      },
      select: IntegrationAccountSelect,
    });
  }

  async deleteIntegrationAccount(
    integrationAccountRequestIdBody: IntegrationAccountIdDto,
  ) {
    return await this.prisma.integrationAccount.update({
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
  }

  async getIntegrationAccount(
    integrationAccountRequestBody: IntegrationAccountRequestBody,
  ) {
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: {
        workspaceId: integrationAccountRequestBody.workspaceId,
        id: integrationAccountRequestBody.integrationAccountId,
      },
      select: IntegrationAccountSelect,
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
      select: IntegrationAccountSelect,
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
      select: IntegrationAccountSelect,
    });
  }

  async getIntegrationAccountByAccountId(accountId: string) {
    return await this.prisma.integrationAccount.findFirst({
      where: { accountId, deleted: null },
      select: IntegrationAccountSelect,
    });
  }

  async getPersonalIntegrationAccount(personalAccountData: PersonalAccountDto) {
    const {
      workspaceId,
      userId: integratedById,
      definitionSlug: slug,
    } = personalAccountData;

    return await this.prisma.integrationAccount.findFirst({
      where: {
        integratedById,
        personal: true,
        workspaceId,
        integrationDefinition: {
          slug,
        },
      },
      select: IntegrationAccountSelect,
    });
  }
}
