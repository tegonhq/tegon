import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  IntegrationAccount,
  IntegrationAccountIdDto,
  PersonalAccountDto,
  UpdateIntegrationAccountDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import { IntegrationAccountsRequestBody } from './integration-account.interface';
import { IntegrationAccountService } from './integration-account.service';

@Controller({
  version: '1',
  path: 'integration_account',
})
export class IntegrationAccountController {
  constructor(private integrationAccountService: IntegrationAccountService) {}

  /**
   * Get all integration accounts in a workspace
   */
  @Get()
  @UseGuards(AuthGuard)
  async getIntegrationAccounts(
    @Query()
    integrationAccountsRequestBody: IntegrationAccountsRequestBody,
  ): Promise<IntegrationAccount[]> {
    return await this.integrationAccountService.getIntegrationAccountsForWorkspace(
      integrationAccountsRequestBody.workspaceId,
    );
  }

  @Get('account_id')
  @UseGuards(AuthGuard)
  async getIntegrationAccountByAccountId(
    @Query('accountId') accountId: string,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.getIntegrationAccountByAccountId(
      accountId,
    );
  }

  @Get('personal')
  @UseGuards(AuthGuard)
  async getPersonalIntegrationAccount(
    @Query() personalAccountParams: PersonalAccountDto,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.getPersonalIntegrationAccount(
      personalAccountParams,
    );
  }

  /**
   * Get a integration accounts in a workspace
   */
  @Get(':integrationAccountId')
  @UseGuards(AuthGuard)
  async getIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountIdDto,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.getIntegrationAccountWithId(
      integrationAccountIdRequestIdBody,
    );
  }

  /**
   * Delete a Integration account
   */
  @Delete(':integrationAccountId')
  @UseGuards(AuthGuard)
  async deleteIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountIdDto,
  ) {
    return await this.integrationAccountService.deleteIntegrationAccount(
      integrationAccountIdRequestIdBody,
    );
  }

  /**
   * Update a integration account in workspace
   */
  @Post(':integrationAccountId')
  @UseGuards(AuthGuard)
  async updateIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountIdDto,
    @Body()
    updateIntegrationAccountBody: UpdateIntegrationAccountDto,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.updateIntegrationAccount(
      integrationAccountIdRequestIdBody.integrationAccountId,
      updateIntegrationAccountBody,
    );
  }
}
